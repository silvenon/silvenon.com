import rehypePrettyCode, { Options } from 'rehype-pretty-code'
import type { Element } from 'hast'
import minLightTheme from 'shiki/themes/min-light.json'
import noctisTheme from '../themes/noctis.json'

interface Theme extends JSON {
  tokenColors: Array<{
    scope?: string | string[]
    settings: {
      foreground: string
    }
  }>
}

export async function configureRehypePrettyCode(): Promise<
  [typeof rehypePrettyCode, Partial<Options>]
> {
  const lightTheme: Theme = {
    ...minLightTheme,
    // rehype-pretty-code expects a less specific type
    // @ts-expect-error
    tokenColors: minLightTheme.tokenColors.map((tokenColor) => {
      const { scope } = tokenColor
      if (
        (typeof scope === 'string' && scope === 'comment') ||
        (Array.isArray(scope) && scope.includes('comment'))
      ) {
        return {
          ...tokenColor,
          settings: {
            // min-light's comment color is too light
            ...tokenColor.settings,
            foreground: '#a3a3a3',
          },
        }
      }
      return tokenColor
    }),
  }

  // rehype-pretty-code expects a less specific type
  // @ts-expect-error
  const darkTheme: Theme = noctisTheme

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
