import rehypePrettyCode, { Options } from 'rehype-pretty-code'
import fs from 'fs/promises'
import type { Element } from 'hast'

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
