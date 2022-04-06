import { bundleMDX } from 'mdx-bundler'
import { configureRehypePrettyCode } from './rehype-pretty-code'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import browserslist from 'browserslist'
import esbuildPluginCloudinary from './esbuild-plugin-cloudinary.server'
import clsx from 'clsx'
import type { Root } from 'hast'
import type TPQueue from 'p-queue'

async function bundleMDXPost(content: string) {
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
        removeFragmentDivs,
        hideDuplicateCodeBlocks,
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

// turn "fragment" divs created by rehype-pretty-code into actual fragments by removing them
function removeFragmentDivs() {
  return async function transform(tree: Root) {
    const { visit } = await import('unist-util-visit')
    visit(
      tree,
      { type: 'element', tagName: 'div' },
      function visitor(node, index, parent) {
        if (
          typeof node.properties?.['data-rehype-pretty-code-fragment'] ===
          'undefined'
        ) {
          return
        }
        if (typeof parent?.children === 'undefined') return
        if (typeof index !== 'number') return
        parent?.children.splice(index, 1, ...node.children)
      },
    )
  }
}

// rehype-pretty-code is configured to generate duplicate code blocks, once for each theme
// so we need to show the dark theme if dark mode is on, and light theme if it's off
function hideDuplicateCodeBlocks() {
  return async function transform(tree: Root) {
    const { visit } = await import('unist-util-visit')
    visit(tree, { type: 'element', tagName: 'pre' }, function visitor(node) {
      if (node.children[0].type !== 'element') return
      const theme = node.children[0].properties?.['data-theme']
      if (typeof theme === 'undefined') return
      Object.assign(node.properties, {
        className: clsx(
          node.properties?.className,
          theme === 'light' ? 'dark:hidden' : 'hidden dark:block',
        ),
      })
    })
  }
}

let _queue: TPQueue | null = null
async function getQueue() {
  const { default: PQueue } = await import('p-queue')
  if (_queue) return _queue

  _queue = new PQueue({ concurrency: 1 })
  return _queue
}

// We have to use a queue because we can't run more than one of these at a time
// or we'll hit an out of memory error because esbuild uses a lot of memory
async function queuedBundleMDXPost(...args: Parameters<typeof bundleMDXPost>) {
  const queue = await getQueue()
  const result = await queue.add(() => bundleMDXPost(...args))
  return result
}

export { queuedBundleMDXPost as bundleMDXPost }
