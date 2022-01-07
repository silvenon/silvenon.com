import { useEffect, useState } from 'react'
import {
  Gitgraph as OriginalGitgraph,
  TemplateName,
  templateExtend,
} from '@gitgraph/react'
import { GitgraphUserApi } from '@gitgraph/core'
import { useMedia } from '../hooks/useMedia'
import { screens } from '../consts'

type Props = {
  children: GitgraphUserApi<React.ReactElement<SVGElement>>
}

const Gitgraph = ({ children }: Props) => {
  const [hasJs, setHasJs] = useState(false)
  const matchesSm = useMedia(`(min-width: ${screens.sm})`)

  useEffect(() => {
    setHasJs(true)
  }, [])

  if (!hasJs) {
    return (
      <div className="py-4 border-y-2 border-y-slate-200 text-slate-400 text-lg text-center font-light tracking-wide md:text-xl dark:border-y-gray-600 dark:text-gray-500">
        JavaScript needs to be enabled for this Git illustration.
      </div>
    )
  }

  return (
    <div className="flex justify-center overflow-x-auto overflow-scrolling-touch font-mono text-xs sm:text-sm lg:text-base">
      {/* TODO: probably a bug in Gitgraph's TS definition
      // @ts-ignore */}
      <OriginalGitgraph
        options={{
          template: templateExtend(TemplateName.Metro, {
            colors: ['one', 'two', 'three'].map(
              (num) => `var(--gitgraph-color-branch-${num})`,
            ),
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
    </div>
  )
}

export default Gitgraph
