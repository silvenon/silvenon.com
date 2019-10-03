// @flow
import React from 'react'
import {
  Gitgraph as OriginalGitgraph,
  TemplateName,
  templateExtend,
} from '@gitgraph/react'
import withClassNames from './with-class-names'
import styles from './gitgraph.module.css'
import { customProperties } from '../styles/globals.module.css'

type Props = {
  children: () => {},
}

export const template = templateExtend(TemplateName.Metro, {
  colors: [
    customProperties['--light-grey'],
    customProperties['--blue'],
    customProperties['--red'],
  ],
  branch: {
    lineWidth: 6,
    spacing: 40,
    label: {
      font: `1rem ${customProperties['--code-font-family']}`,
    },
  },
  commit: {
    spacing: 60,
    message: {
      displayAuthor: false,
      font: `1rem ${customProperties['--code-font-family']}`,
    },
  },
})

function Gitgraph(props: Props) {
  return (
    <div {...props}>
      <OriginalGitgraph
        options={{
          template,
        }}
      >
        {props.children}
      </OriginalGitgraph>
    </div>
  )
}

export default withClassNames(styles.container)(Gitgraph)
