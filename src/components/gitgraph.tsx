import React from 'react'
import {
  Gitgraph as OriginalGitgraph,
  TemplateName,
  templateExtend,
} from '@gitgraph/react'
import { GitgraphUserApi } from '@gitgraph/core'
import styled from 'styled-components'
import theme from '../styles/theme'

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

type Props = {
  children: GitgraphUserApi<React.ReactElement<SVGElement>>
}

export const template = templateExtend(TemplateName.Metro, {
  colors: [theme.color.lightGrey, theme.color.blue, theme.color.red],
  branch: {
    lineWidth: 6,
    spacing: 40,
    label: {
      font: `1rem var(--code-font-family)`,
    },
  },
  commit: {
    spacing: 60,
    message: {
      displayAuthor: false,
      font: `1rem var(--code-font-family)`,
    },
  },
})

const Gitgraph = ({ children }: Props) => {
  return (
    <Container>
      {/* probably a bug in Gitgraph's TS definition
      // @ts-ignore */}
      <OriginalGitgraph
        options={{
          template,
        }}
      >
        {children}
      </OriginalGitgraph>
    </Container>
  )
}

export default Gitgraph
