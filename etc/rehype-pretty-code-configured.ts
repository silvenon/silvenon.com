import rehypePrettyCode, { type Options } from 'rehype-pretty-code'
import type { Pluggable } from 'unified'

const rehypePrettyCodeConfigured: Pluggable = [
  rehypePrettyCode,
  {
    defaultLang: 'plaintext',
    theme: {
      light: 'vitesse-light',
      dark: 'slack-dark',
    },
    onVisitLine(node) {
      // Prevent lines from collapsing in `display: grid` mode
      // allowing empty lines to be copy/pasted
      if (node.children.length === 0) {
        node.children = [{ type: 'text', value: ' ' }]
      }
    },
  } satisfies Options,
]

export default rehypePrettyCodeConfigured
