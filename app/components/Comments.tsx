import { useCallback } from 'react'
import { useDarkMode } from '~/services/dark-mode'

/**
 * Adapted from https://www.npmjs.com/package/utterances-react-component
 */

const SOURCE = 'https://utteranc.es/client.js'
const REPO = 'silvenon/silvenon.com'
const ISSUE_TERM = 'title'

type Theme = 'preferred-color-scheme' | 'github-dark' | 'github-light'

export default function Comments() {
  const darkMode = useDarkMode()

  let theme: Theme

  if (darkMode === null) {
    theme = 'preferred-color-scheme'
  } else if (darkMode) {
    theme = 'github-dark'
  } else {
    theme = 'github-light'
  }

  const initialize = useCallback<React.RefCallback<HTMLDivElement>>(
    (node) => {
      if (!node) return

      if (import.meta.hot) {
        node.replaceChildren()
      }

      const scriptEl = document.createElement('script')

      scriptEl.src = SOURCE
      scriptEl.async = true
      scriptEl.setAttribute('crossorigin', 'anonymous')

      scriptEl.setAttribute('repo', REPO)
      scriptEl.setAttribute('issue-term', ISSUE_TERM)
      scriptEl.setAttribute('theme', theme)

      node.appendChild(scriptEl)
    },
    // comment section should not reset when the theme changes in case the reader is typing a comment
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return <div ref={initialize} />
}
