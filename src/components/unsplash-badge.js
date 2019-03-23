// @flow
// this component is based on the official Unsplash embed code
import React from 'react'
import { CameraIcon } from './icons'
import styles from './unsplash-badge.module.css'

type Props = {
  fullName: string,
  userName: string,
}

const UnsplashBadge = ({ fullName, userName }: Props) => (
  <a
    href={`https://unsplash.com/@${userName}?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge`}
    target="_blank"
    rel="noopener noreferrer"
    title={`Download free do whatever you want high-resolution photos from ${fullName}`}
    className={styles.button}
  >
    <span className={styles.iconContainer}>
      <CameraIcon className={styles.icon} />
    </span>
    <span className={styles.name}>{fullName}</span>
  </a>
)

export default UnsplashBadge
