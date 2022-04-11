import type { GitgraphUserApi } from '@gitgraph/core'
import { v4 as uuid } from 'uuid'
import dedent from 'dedent'
import { screens } from '../consts'

type Props = {
  children: GitgraphUserApi<React.ReactElement<SVGElement>>
}

const Gitgraph = ({ children }: Props) => {
  const id = uuid()

  return (
    <>
      <div
        id={id}
        className="overflow-scrolling-touch flex justify-center overflow-x-auto font-mono text-xs sm:text-sm lg:text-base"
      >
        <div className="border-y-2 border-y-slate-200 py-4 text-center text-lg font-light tracking-wide text-slate-400 dark:border-y-gray-600 dark:text-gray-500 md:text-xl">
          JavaScript needs to be enabled for this Git illustration.
        </div>
      </div>
      <script defer src="https://cdn.jsdelivr.net/npm/@gitgraph/js" />
      <script
        dangerouslySetInnerHTML={{
          __html: dedent`
            ;(() => {
              document.addEventListener('DOMContentLoaded', () => {
                const container = document.getElementById(${JSON.stringify(id)})
                container.innerHTML = ''
                const mql = window.matchMedia('(min-width: ${screens.sm})')
                const gitgraph = GitgraphJS.createGitgraph(container, {
                  template: GitgraphJS.templateExtend('metro', {
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

                const createGraph = Function(${JSON.stringify(
                  `return ${String(children)}`,
                )})()

                createGraph(gitgraph)
              })
            })()
          `,
        }}
      />
    </>
  )
}

export default Gitgraph
