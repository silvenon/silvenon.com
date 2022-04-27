import { bundleMDX } from 'mdx-bundler'
import rehypePrettyCodePlugins from './utils/rehype-pretty-code'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import browserslist from 'browserslist'
import esbuildPluginCloudinary from './utils/esbuild-plugin-cloudinary'
import fs from 'fs/promises'
import path from 'path'
import chokidar from 'chokidar'

const SOURCE_DIR = `${__dirname}/../posts`
const OUTPUT_DIR = `${__dirname}/../app/posts`

async function compilePosts() {
  const dirents = await fs.readdir(`${__dirname}/../posts`, {
    withFileTypes: true,
  })

  const postFiles: string[] = []

  for (const dirent of dirents) {
    if (dirent.name === '__tests__') continue
    if (dirent.isFile()) {
      if (!dirent.name.endsWith('.mdx')) continue
      postFiles.push(dirent.name)
    } else {
      const seriesSlug = dirent.name
      const partDirents = await fs.readdir(path.join(SOURCE_DIR, seriesSlug), {
        withFileTypes: true,
      })
      for (const partDirent of partDirents) {
        if (
          partDirent.name === 'series.json' ||
          partDirent.name.endsWith('.mdx')
        ) {
          postFiles.push(`${seriesSlug}/${partDirent.name}`)
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    const watcher = chokidar.watch(['**/*.mdx', '**/series.json'], {
      cwd: SOURCE_DIR,
    })
    watcher.on('change', (path) => compile(path))
    console.log('Watching posts for changes...')
  } else {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true })
    console.log('Compiling posts...')
    console.time('Compiled posts')
    await Promise.all(postFiles.map((file) => compile(file)))
    console.timeEnd('Compiled posts')
  }
}

async function compile(file: string) {
  if (path.basename(file) === 'series.json') {
    const outputPath = path.join(OUTPUT_DIR, file)
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.copyFile(path.join(SOURCE_DIR, file), outputPath)
    return
  }

  const [{ default: remarkSmartypants }, { default: remarkUnwrapImages }] =
    await Promise.all([
      import('remark-smartypants'),
      import('remark-unwrap-images'),
    ])

  const { code } = await bundleMDX({
    file: path.join(SOURCE_DIR, file),
    cwd: path.dirname(path.join(SOURCE_DIR, file)),
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
      return options
    },
  })

  const outputPath = path.join(OUTPUT_DIR, file).replace(/\.mdx$/, '.js')
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, code)
}

compilePosts()
