import { createGitgraph, MergeStyle } from '@gitgraph/js'
import GitgraphEvent from './GitgraphEvent'
import { screens, colors } from './consts'

const font = 'inherit'

export default function initGitgraph() {
  const mqlSm = window.matchMedia(`(min-width: ${screens.sm})`)
  const mqlDark = window.matchMedia(`(prefers-color-scheme: dark)`)

  function isDark() {
    return mqlDark.matches
  }

  window.dispatchEvent(
    new GitgraphEvent({
      init(
        container: HTMLDivElement,
        callback: (api: ReturnType<typeof createGitgraph>) => void,
      ) {
        generateGitgraph()
        mqlSm.addEventListener('change', generateGitgraph)
        mqlDark.addEventListener('change', generateGitgraph)

        function generateGitgraph() {
          container.textContent = ''
          const api = createGitgraph(container, {
            template: {
              colors: [
                isDark() ? colors.gray['200'] : colors.gray['500'],
                isDark() ? colors.purple['400'] : colors.purple['700'],
                isDark() ? colors.yellow['400'] : colors.yellow['600'],
              ],
              arrow: {
                color: null,
                size: null,
                offset: 0,
              },
              branch: {
                lineWidth: mqlSm.matches ? 6 : 5,
                spacing: mqlSm.matches ? 46 : 30,
                label: {
                  display: true,
                  bgColor: 'transparent',
                  borderRadius: 10,
                  font,
                },
                mergeStyle: MergeStyle.Bezier,
              },
              commit: {
                spacing: mqlSm.matches ? 46 : 36,
                hasTooltipInCompactMode: true,
                dot: {
                  size: mqlSm.matches ? 14 : 10,
                  font,
                },
                message: {
                  display: true,
                  displayAuthor: false,
                  displayHash: true,
                  font,
                },
              },
              tag: {},
            },
          })
          callback(api)
        }
      },
    }),
  )
}

if (process.env.NODE_ENV !== 'test') {
  initGitgraph()
}
