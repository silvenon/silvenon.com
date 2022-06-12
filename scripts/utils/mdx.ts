import { bundleMDX } from 'mdx-bundler'
import rehypePrettyCodePlugins from './rehype-pretty-code'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import browserslist from 'browserslist'
import esbuildPluginCloudinary from './esbuild-plugin-cloudinary'
import path from 'path'

export async function compileMDXFile(file: string): Promise<string> {
  const [{ default: remarkSmartypants }, { default: remarkUnwrapImages }] =
    await Promise.all([
      import('remark-smartypants'),
      import('remark-unwrap-images'),
    ])

  const { code } = await bundleMDX({
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

  return code
}
