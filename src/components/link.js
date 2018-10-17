// @flow
import * as React from 'react'
// import { Link } from 'gatsby'
import withClassNames from './with-class-names'
import styles from './link.module.css'

type Props = {
  to: string,
  children: React.Node,
}

// avoiding Gatsby's <Link> until style duplication gets resolved
// https://github.com/gatsbyjs/gatsby/issues/7517

const Link = ({ to, children, ...props }: Props) => (
  <a href={to} {...props}>
    {children}
  </a>
)

export default withClassNames(styles.link)(Link)
