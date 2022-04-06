import { bundleMDX } from 'mdx-bundler'
import { configureRehypePrettyCode } from './rehype-pretty-code'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import browserslist from 'browserslist'
import esbuildPluginCloudinary from './esbuild-plugin-cloudinary.server'

export async function bundleMDXPost(content: string) {
  // the official recommendation for importing ESM-only packages is to use serverDependenciesToBundle
  // howeever, that causes these plugins not tu have effect in development for some reason
  // https://remix.run/docs/en/v1/pages/gotchas#importing-esm-packages
  const { default: remarkSmartypants } = await import('remark-smartypants')
  const { default: remarkUnwrapImages } = await import('remark-unwrap-images')

  const configuredRehypePrettyCode = configureRehypePrettyCode()

  const { code, errors } = await bundleMDX({
    source: content,
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkSmartypants,
        remarkUnwrapImages,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        configuredRehypePrettyCode,
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

  if (errors.length) {
    throw new Error(errors.join('\n'))
  }

  return code
}
