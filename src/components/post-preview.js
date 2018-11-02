// @flow
import * as React from 'react'
import Meta from './meta'
import Date from './date'
import { P } from './body'
import Link from './link'
import styles from './post-preview.module.css'

type Props = {
  isSmall: boolean,
  path: string,
  title: string,
  dateTime: string,
  excerpt: string,
}

const PostPreview = ({ isSmall, path, title, dateTime, excerpt }: Props) => (
  <article>
    <h1 className={isSmall ? styles.smallTitle : styles.title}>
      <Link to={path}>{title}</Link>
    </h1>
    <Meta className={styles.meta}>
      <Date dateTime={dateTime} />
    </Meta>
    <P>{excerpt}</P>
    <div className={styles.more}>
      <Link to={path}>Read more →</Link>
    </div>
  </article>
)

PostPreview.defaultProps = {
  isSmall: false,
}

export default PostPreview
