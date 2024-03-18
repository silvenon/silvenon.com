import remarkFronmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkSmartypants from 'remark-smartypants'
import remarkUnwrapImages from 'remark-unwrap-images'
import rehypePrettyCode from 'rehype-pretty-code'
import type { Element, Root } from 'hast'
import { lightThemeName, darkThemeName } from './code-theme.ts'
import clsx from 'clsx'
import { visit } from 'unist-util-visit'

export const mdxOptions = {
  remarkPlugins: [
    remarkFronmatter,
    remarkMdxFrontmatter,
    remarkSmartypants,
    remarkUnwrapImages,
  ],
  rehypePlugins: [
    [
      rehypePrettyCode,
      {
        theme: {
          light: lightThemeName,
          dark: darkThemeName,
        },
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
        onVisitHighlightedChars(node: Element) {
          addClassName(node, 'bg-code-highlight dark:bg-code-highlight-dark')
        },
      },
    ],
    rehypeRemoveFragmentDivs,
    rehypeHideDuplicateCodeBlocks,
  ],
} satisfies import('@mdx-js/rollup').Options

// turn "fragment" divs created by rehype-pretty-code into actual fragments by removing them
function rehypeRemoveFragmentDivs() {
  return function transform(tree: Root) {
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
  return function transform(tree: Root) {
    visit(tree, 'element', function visitor(node, _index, parent) {
      if (node.tagName !== 'pre' && node.tagName !== 'code') return
      if (
        node.tagName === 'code' &&
        typeof parent !== 'undefined' &&
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
