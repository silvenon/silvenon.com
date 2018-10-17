// @flow
import * as React from 'react'
import styles from './intrinsic-ratio.module.css'

// https://css-tricks.com/aspect-ratio-boxes

type Props = {
  width: string | number,
  height: string | number,
  children: React.Node,
}

const IntrinsicRatio = ({ width, height, children }: Props) => (
  <div className={styles.container} style={{ width }}>
    <div
      className={styles.inner}
      style={{
        paddingTop: `${(parseFloat(height) / parseFloat(width)) * 100}%`,
      }}
    >
      {children}
    </div>
  </div>
)

export default IntrinsicRatio
