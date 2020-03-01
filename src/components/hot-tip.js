// @flow
import React, { type Node } from 'react'
import classNames from 'classnames'
import styles from './hot-tip.module.css'

type Props = {
  className: ?string,
  children: Node,
}

function HotTip({ className, children, ...props }: Props) {
  return (
    <section {...props} className={classNames(styles.container, className)}>
      <h1 className={styles.title}>Hot tip!</h1>
      {children}
    </section>
  )
}

export default HotTip
