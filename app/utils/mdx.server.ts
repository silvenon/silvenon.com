import fs from 'fs/promises'
import path from 'path'
import { bundleMDX } from 'mdx-bundler'
import { configureRehypePrettyCode } from './rehype-pretty-code'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import browserslist from 'browserslist'
import esbuildPluginCloudinary from './esbuild-plugin-cloudinary.server'

export async function bundleMDXPost<FrontMatter>(file: string) {
  const { default: remarkSmartypants } = await import('remark-smartypants')
  const { default: remarkUnwrapImages } = await import('remark-unwrap-images')

  try {
    await fs.open(file, 'r')
  } catch {
    throw new Response('Not Found', { status: 404 })
  }

  const configuredRehypePrettyCode = await configureRehypePrettyCode()

  const { frontmatter, code, errors } = await bundleMDX<FrontMatter>({
    file,
    cwd: path.dirname(file),
    xdmOptions: (options) => {
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
        esbuildPluginBrowserslist(browserslist()),
        esbuildPluginCloudinary,
        ...(options.plugins ?? []),
      ]
      return options
    },
  })

  if (errors.length) {
    throw new Response(
      process.env.NODE_ENV === 'development'
        ? errors.join('\n')
        : 'Internal Server Error',
      { status: 500 },
    )
  }

  return { frontmatter, code }
}
