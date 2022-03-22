import rehypePrettyCode, { Options } from 'rehype-pretty-code'
import type { Element } from 'hast'
import originalLightTheme from 'shiki/themes/min-light.json'
import originalDarkTheme from 'shiki/themes/dracula-soft.json'

interface Theme extends JSON {
  tokenColors: Array<{
    scope?: string | string[]
    settings: {
      foreground: string
    }
  }>
}

export function configureRehypePrettyCode(): [
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
