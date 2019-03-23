// @flow
import React, { type Node } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import withClassNames from './with-class-names'
import styles from './link.module.css'

type Props = {
  to: string,
  children: Node,
}

// avoiding Gatsby's <Link> in production until style duplication gets resolved
// https://github.com/gatsbyjs/gatsby/issues/7517

const Link = ({ to, children, ...props }: Props) =>
  process.env.NODE_ENV === 'production' ? (
    <a href={to} {...props}>
      {children}
    </a>
  ) : (
    <GatsbyLink to={to} {...props}>
      {children}
    </GatsbyLink>
  )

export default withClassNames(styles.link)(Link)
