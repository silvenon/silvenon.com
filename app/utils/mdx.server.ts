import fs from 'fs/promises'
import path from 'path'
import { bundleMDX } from 'mdx-bundler'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import browserslist from 'browserslist'
import { createRemarkPlugin as createPrettyCodePlugin } from '@atomiks/mdx-pretty-code'
import esbuildPluginCloudinary from './esbuild-plugin-cloudinary.server'

interface Theme extends JSON {
  tokenColors: Array<{
    scope?: string | string[]
    settings: {
      foreground: string
    }
  }>
}

export async function bundleMDXPost<FrontMatter>(file: string) {
  const { default: remarkSmartypants } = await import('remark-smartypants')
  const { default: remarkUnwrapImages } = await import('remark-unwrap-images')
  const { default: rehypeRaw } = await import('rehype-raw')
  const { nodeTypes: xdmNodeTypes } = await import('xdm/lib/node-types.js')

  try {
    await fs.open(file, 'r')
  } catch {
    throw new Response('Not Found', { status: 404 })
  }

  const lightTheme: Theme = JSON.parse(
    await fs.readFile(
      `${__dirname}/../../node_modules/shiki/themes/min-light.json`,
      'utf8',
    ),
  )
  lightTheme.tokenColors.forEach(({ scope }, index) => {
    if (
      (typeof scope === 'string' && scope === 'comment') ||
      (Array.isArray(scope) && scope.includes('comment'))
    ) {
      // min-light's comment color is too light
      lightTheme.tokenColors[index].settings.foreground = '#a3a3a3'
    }
  })

  const darkTheme: Theme = JSON.parse(
    await fs.readFile(`${__dirname}/../../app/themes/noctis.json`, 'utf8'),
  )

  const prettyCode = createPrettyCodePlugin({
    shikiOptions: {
      theme: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
    onVisitHighlightedLine(node: HTMLElement) {
      node.className += ' line-highlighted'
    },
  })

  const { frontmatter, code, errors } = await bundleMDX<FrontMatter>({
    file,
    cwd: path.dirname(file),
    xdmOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        prettyCode,
        remarkSmartypants,
        remarkUnwrapImages,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        // parse raw nodes created by @atomiks/mdx-pretty-code
        // https://github.com/wooorm/xdm/issues/105#issuecomment-1006207584
        [
          rehypeRaw,
          // ignore XDM-specific nodes, otherwise rehype-raw would throw
          { passThrough: xdmNodeTypes },
        ],
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
