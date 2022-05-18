import rehypePrettyCode from 'rehype-pretty-code'
import type { Options } from 'rehype-pretty-code'
import type { Element } from 'hast'
import originalLightTheme from 'shiki/themes/min-light.json'
import originalDarkTheme from 'shiki/themes/dracula-soft.json'
import clsx from 'clsx'
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
  const lightTheme: Theme = {
    ...originalLightTheme,
    // rehype-pretty-code expects a less specific type
    // @ts-expect-error
    tokenColors: originalLightTheme.tokenColors.map((tokenColor) => {
      const { scope } = tokenColor
      if (
        (typeof scope === 'string' && scope === 'comment') ||
        (Array.isArray(scope) && scope.includes('comment'))
      ) {
        return {
          ...tokenColor,
          settings: {
            // min-light's comment color is too bright
            ...tokenColor.settings,
            foreground: '#a3a3a3',
          },
        }
      }
      return tokenColor
    }),
  }

  // cast to a less specific type, required by rehype-pretty-code
  // @ts-expect-error
  const darkTheme: Theme = originalDarkTheme

  return [
    rehypePrettyCode,
    {
      theme: {
        light: lightTheme,
        dark: darkTheme,
      },
      onVisitLine(node: Element) {
        // Prevent lines from collapsing in `display: grid` mode
        // allowing empty lines to be copy/pasted
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }]
        }
      },
      onVisitHighlightedLine(node: Element) {
        addClassName(node, 'highlighted')
      },
      onVisitHighlightedWord(node: Element) {
        addClassName(node, 'word')
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
function rehypeHideDuplicateCodeBlocks() {
  return async function transform(tree: Root) {
    const { visit } = await import('unist-util-visit')
    visit(tree, { type: 'element', tagName: 'pre' }, function visitor(node) {
      const theme = node.properties?.['data-theme']
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
