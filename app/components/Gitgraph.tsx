import { TemplateName } from '@gitgraph/core'
import type { GitgraphUserApi } from '@gitgraph/core'
import type { createGitgraph, templateExtend } from '@gitgraph/js'
import { v4 as uuid } from 'uuid'
import { screens } from '../consts'

type Props = {
  children: (gitgraph: GitgraphUserApi<SVGElement>) => void
}

declare global {
  interface Window {
    GitgraphJS: {
      createGitgraph: typeof createGitgraph
      templateExtend: typeof templateExtend
    }
  }
}

const Gitgraph = ({ children }: Props) => {
  const id = uuid()

  return (
    <>
      <div
        id={id}
        className="overflow-scrolling-touch flex justify-center overflow-x-auto font-mono text-xs sm:text-sm lg:text-base"
        data-testid="gitgraph"
      >
        <noscript>
          <div className="border-y-2 border-y-slate-200 py-4 text-center font-sans text-lg font-light tracking-wide text-slate-400 dark:border-y-gray-600 dark:text-gray-500 md:text-xl">
            JavaScript needs to be enabled for this Git illustration.
          </div>
        </noscript>
      </div>
      <script defer src="https://cdn.jsdelivr.net/npm/@gitgraph/js" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            ;(${function initialize({
              containerId,
              breakpoint,
              baseTemplate,
              createGraph,
            }: {
              containerId: string
              breakpoint: string
              baseTemplate: TemplateName
              createGraph(gitgraph: GitgraphUserApi<SVGElement>): void
            }) {
              document.addEventListener('DOMContentLoaded', () => {
                const container = document.getElementById(containerId)
                if (container === null) return
                container.innerHTML = ''
                const mql = window.matchMedia(`(min-width: ${breakpoint})`)
                const gitgraph = window.GitgraphJS.createGitgraph(container, {
                  template: window.GitgraphJS.templateExtend(baseTemplate, {
                    colors: [
                      'var(--gitgraph-color-branch-one)',
                      'var(--gitgraph-color-branch-two)',
                      'var(--gitgraph-color-branch-three)',
                    ],
                    arrow: {
                      color: null,
                      size: null,
                      offset: 0,
                    },
                    branch: {
                      lineWidth: mql.matches ? 6 : 5,
                      spacing: mql.matches ? 46 : 30,
                      label: {
                        display: true,
                        bgColor: 'transparent',
                        borderRadius: 10,
                        font: 'inherit',
                      },
                    },
                    commit: {
                      spacing: mql.matches ? 46 : 36,
                      hasTooltipInCompactMode: true,
                      dot: {
                        size: mql.matches ? 14 : 10,
                        font: 'inherit',
                      },
                      message: {
                        display: true,
                        displayAuthor: false,
                        displayHash: true,
                        font: 'inherit',
                      },
                    },
                    tag: {},
                  }),
                })

                createGraph(gitgraph)
              })
            }})({
              containerId: ${JSON.stringify(id)},
              breakpoint: ${JSON.stringify(screens.sm)},
              baseTemplate: ${JSON.stringify(TemplateName.Metro)},
              createGraph: ${children},
            })
          `,
        }}
      />
    </>
  )
}

export default Gitgraph
