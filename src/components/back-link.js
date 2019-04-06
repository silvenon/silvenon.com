// @flow
import React, { type Node } from 'react'
import Icon from './icon'
import Link from './link'
import withClassNames from './with-class-names'
import styles from './back-link.module.css'

type Props = {
  children: Node,
}

const BackLink = ({ children, ...props }: Props) => (
  <Link {...props}>
    <Icon id="arrow-left" className={styles.icon} />
    <div>{children}</div>
  </Link>
)

export default withClassNames(styles.link)(BackLink)
