// @flow
import React from 'react'
import styles from './center.module.css'

type Props = {
  children: React$Node,
}

function Center({ children }: Props) {
  return <div className={styles.container}>{children}</div>
}

export default Center
