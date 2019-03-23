// @flow
import React, { type Node } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import Link from './link'
import withClassNames from './with-class-names'
import styles from './back-link.module.css'

type Props = {
  children: Node,
}

const BackLink = ({ children, ...props }: Props) => (
  <Link {...props}>
    <FaArrowLeft className={styles.icon} />
    <div>{children}</div>
  </Link>
)

export default withClassNames(styles.link)(BackLink)
