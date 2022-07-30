import {
  Gitgraph as OriginalGitgraph,
  TemplateName,
  templateExtend,
} from '@gitgraph/react'
import type { GitgraphUserApi } from '@gitgraph/core'
import { useMediaQuery } from '@react-hook/media-query'
import { useState, useEffect } from 'react'
import { screens } from '../consts'

interface Props {
  children(gitgraph: GitgraphUserApi<React.ReactElement<SVGElement>>): void
}

const Gitgraph = ({ children }: Props) => {
  const matchesSm = useMediaQuery(`(min-width: ${screens.sm})`)
  const [hasJs, setHasJs] = useState(false)

  useEffect(() => {
    setHasJs(true)
  }, [])

  return (
    <div
      className="flex justify-center overflow-x-auto font-mono text-xs [-webkit-overflow-scrolling:touch] sm:text-sm lg:text-base"
      data-testid="gitgraph"
    >
      {hasJs ? (
        <OriginalGitgraph
          options={{
            template: templateExtend(TemplateName.Metro, {
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
                lineWidth: matchesSm ? 6 : 5,
                spacing: matchesSm ? 46 : 30,
                label: {
                  display: true,
                  bgColor: 'transparent',
                  borderRadius: 10,
                  font: 'inherit',
                },
              },
              commit: {
                spacing: matchesSm ? 46 : 36,
                hasTooltipInCompactMode: true,
                dot: {
                  size: matchesSm ? 14 : 10,
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
          }}
        >
          {children}
        </OriginalGitgraph>
      ) : (
        <div className="border-y-2 border-y-slate-200 py-4 text-center font-sans text-lg font-light tracking-wide text-slate-400 dark:border-y-gray-600 dark:text-gray-500 md:text-xl">
          JavaScript needs to be enabled for this Git illustration.
        </div>
      )}
    </div>
  )
}

export default Gitgraph
