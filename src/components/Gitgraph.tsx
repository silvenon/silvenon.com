import React from 'react'
import {
  Gitgraph as OriginalGitgraph,
  TemplateName,
  templateExtend,
} from '@gitgraph/react'
import { GitgraphUserApi } from '@gitgraph/core'
import { useMediaQueries } from '@react-hook/media-query'
import { screens } from '../consts'

type Props = {
  children: GitgraphUserApi<React.ReactElement<SVGElement>>
}

const Gitgraph = ({ children }: Props) => {
  const { matches } = useMediaQueries({
    sm: `(min-width: ${screens.sm})`,
    dark: '(prefers-color-scheme: dark)',
  })
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
              lineWidth: matches.sm ? 6 : 5,
              spacing: matches.sm ? 46 : 30,
              label: {
                display: true,
                bgColor: 'transparent',
                borderRadius: 10,
                font: 'inherit',
              },
            },
            commit: {
              spacing: matches.sm ? 46 : 36,
              hasTooltipInCompactMode: true,
              dot: {
                size: matches.sm ? 14 : 10,
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
