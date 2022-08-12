import { bundleMDX } from 'mdx-bundler'
import rehypePrettyCodePlugins from './rehype-pretty-code'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import browserslist from 'browserslist'
import esbuildPluginCloudinary from './esbuild-plugin-cloudinary'
import path from 'path'

// https://github.com/kentcdodds/mdx-bundler/blob/main/README.md#nextjs-esbuild-enoent
if (process.platform === 'win32') {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'esbuild.exe',
  )
} else {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'bin',
    'esbuild',
  )
}

export default async function compilePost<
  Frontmatter extends { [key: string]: any },
>({ file }: { file: string }) {
  const [{ default: remarkSmartypants }, { default: remarkUnwrapImages }] =
    await Promise.all([
      import('remark-smartypants'),
      import('remark-unwrap-images'),
    ])

  const result = await bundleMDX<Frontmatter>({
    file,
    cwd: path.dirname(file),
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

  return result
}
