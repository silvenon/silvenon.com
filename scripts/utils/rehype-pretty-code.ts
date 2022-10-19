import rehypePrettyCode from 'rehype-pretty-code'
import type { Options } from 'rehype-pretty-code'
import type { Element } from 'hast'
import clsx from 'clsx'
import theme from './code-theme'
import type { Root } from 'hast'

interface Theme extends JSON {
  tokenColors: Array<{
    scope?: string | string[]
    settings: {
      foreground: string
    }
  }>
}

const rehypePrettyCodePlugins = [
  configureRehypePrettyCode(),
  rehypeRemoveFragmentDivs,
  rehypeHideDuplicateCodeBlocks,
]

export default rehypePrettyCodePlugins

function configureRehypePrettyCode(): [
  typeof rehypePrettyCode,
  Partial<Options>,
] {
  // cast to a less specific type, required by rehype-pretty-code
  // @ts-expect-error
  const prettyCodeTheme: {
    light: Theme
    dark: Theme
  } = theme

  return [
    rehypePrettyCode,
    {
      theme: prettyCodeTheme,
      onVisitLine(node: Element) {
        addClassName(node, '[pre_&]:block') // should be block only inside <pre>
        // Prevent lines from collapsing in `display: grid` mode
        // allowing empty lines to be copy/pasted
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }]
        }
      },
      onVisitHighlightedLine(node: Element) {
        addClassName(node, 'bg-code-highlight dark:bg-code-highlight-dark')
      },
      onVisitHighlightedWord(node: Element) {
        addClassName(node, 'bg-code-highlight dark:bg-code-highlight-dark')
      },
    },
  ]
}

function addClassName(node: Element, className: string) {
  if (node.properties) {
    if (typeof node.properties.className === 'string') {
      node.properties.className += ` ${className}`
    } else if (Array.isArray(node.properties.className)) {
      node.properties.className.push(className)
    } else {
      node.properties.className = [className]
    }
  }
}

// turn "fragment" divs created by rehype-pretty-code into actual fragments by removing them
function rehypeRemoveFragmentDivs() {
  return async function transform(tree: Root) {
    const { visit } = await import('unist-util-visit')
    visit(tree, 'element', function visitor(node, index, parent) {
      if (
        typeof node.properties?.['data-rehype-pretty-code-fragment'] ===
        'undefined'
      ) {
        return
      }
      if (typeof parent?.children === 'undefined') return
      if (typeof index !== 'number') return
      parent?.children.splice(index, 1, ...node.children)
    })
  }
}

// rehype-pretty-code is configured to generate duplicate code blocks, once for each theme
// so we need to show the dark theme if dark mode is on, and light theme if it's off
function rehypeHideDuplicateCodeBlocks() {
  return async function transform(tree: Root) {
    const { visit } = await import('unist-util-visit')
    visit(tree, 'element', function visitor(node, index, parent) {
      if (node.tagName !== 'pre' && node.tagName !== 'code') return
      if (
        node.tagName === 'code' &&
        parent !== null &&
        parent.type === 'element' &&
        parent.tagName === 'pre'
      ) {
        return
      }
      if (!node.properties) return
      const theme = node.properties['data-theme']
      if (typeof theme === 'undefined') return
      Object.assign(node.properties, {
        className: clsx(
          node.properties?.className,
          theme === 'light'
            ? 'dark:hidden'
            : [
                'hidden border border-gray-700',
                node.tagName === 'pre' ? 'dark:block' : 'dark:inline',
              ],
        ),
      })
    })
  }
}
