import { bundleMDX } from 'mdx-bundler'
import rehypePrettyCodePlugins from './utils/rehype-pretty-code'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import browserslist from 'browserslist'
import esbuildPluginCloudinary from './utils/esbuild-plugin-cloudinary'
import fs from 'fs/promises'
import path from 'path'

const SOURCE_DIR = `${__dirname}/../posts`
const OUTPUT_DIR = `${__dirname}/../app/posts`

async function buildPosts() {
  const [{ default: remarkSmartypants }, { default: remarkUnwrapImages }] =
    await Promise.all([
      import('remark-smartypants'),
      import('remark-unwrap-images'),
    ])

  const dirents = await fs.readdir(`${__dirname}/../posts`, {
    withFileTypes: true,
  })

  const posts = []

  for (const dirent of dirents) {
    if (dirent.name === '__tests__') continue
    if (dirent.isFile()) {
      if (!dirent.name.endsWith('.mdx')) continue
      posts.push(dirent.name)
    } else {
      const seriesSlug = dirent.name
      const partDirents = await fs.readdir(`${SOURCE_DIR}/${seriesSlug}`, {
        withFileTypes: true,
      })
      for (const partDirent of partDirents) {
        if (!partDirent.name.endsWith('.mdx')) continue
        posts.push(`${seriesSlug}/${partDirent.name}`)
      }
    }
  }

  await fs.rm(OUTPUT_DIR, { recursive: true, force: true })

  await Promise.all(
    posts.map(async (post) => {
      const { code } = await bundleMDX({
        file: path.join(SOURCE_DIR, post),
        cwd: path.dirname(path.join(SOURCE_DIR, post)),
        mdxOptions: (options) => {
          options.remarkPlugins = [
            ...(options.remarkPlugins || []),
            remarkSmartypants,
            remarkUnwrapImages,
          ]
          options.rehypePlugins = [
            ...(options.rehypePlugins || []),
            ...rehypePrettyCodePlugins,
          ]
          return options
        },
        esbuildOptions: (options) => {
          options.plugins = [
            esbuildPluginBrowserslist(browserslist(), {
              printUnknownTargets: false,
            }),
            esbuildPluginCloudinary,
            ...(options.plugins ?? []),
          ]
          options.watch =
            process.env.NODE_ENV === 'development'
              ? {
                  async onRebuild(error, result) {
                    if (error) {
                      console.error(`Recompiling posts/${post} failed:`, error)
                      return
                    }
                    if (!result?.outputFiles) {
                      console.error(`Missing outputFiles for posts/${post}`)
                      return
                    }
                    await writeResult(result.outputFiles[0].text)
                    console.log(`Recompiled posts/${post}`)
                  },
                }
              : false
          return options
        },
      })

      await writeResult(code)

      async function writeResult(content: string) {
        const outputPath = path.join(OUTPUT_DIR, post).replace(/\.mdx$/, '.js')
        await fs.mkdir(path.dirname(outputPath), { recursive: true })
        await fs.writeFile(outputPath, content)
      }
    }),
  )

  console.log(
    process.env.NODE_ENV === 'development'
      ? `Compiled posts, watching for changes...`
      : `Compiled posts`,
  )
}

buildPosts()
