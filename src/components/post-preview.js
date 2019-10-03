// @flow
import React from 'react'
import Meta from './meta'
import Date from './date'
import { P } from './body'
import Link from './link'
import Icon from './icon'
import styles from './post-preview.module.css'

type Props = {
  isSmall: boolean,
  path: string,
  title: string,
  dateTime: string,
  excerpt: string,
  series: ?{
    title: string,
    parts: Array<{
      title: string,
      path: string,
    }>,
  },
}

const PostPreview = ({
  isSmall,
  path,
  title,
  dateTime,
  excerpt,
  series,
}: Props) => (
  <article>
    {series != null ? (
      <div className={styles.seriesLabel}>
        <Icon className={styles.icon} id="stack" />
        <div className={styles.text}>Series</div>
      </div>
    ) : null}
    <h1 className={isSmall ? styles.smallTitle : styles.title}>
      <Link to={path}>{series != null ? series.title : title}</Link>
    </h1>
    <Meta className={styles.meta}>
      <Date dateTime={dateTime} />
    </Meta>
    <P>{excerpt}</P>
    <p className={styles.more}>
      <Link to={path}>Read more →</Link>
    </p>
    {series != null ? (
      <>
        <p>Parts of this series:</p>
        <ol className={styles.seriesParts}>
          {series.parts.map(({ title, path }) => (
            <li key={path}>
              <Link to={path}>{title}</Link>
            </li>
          ))}
        </ol>
      </>
    ) : null}
  </article>
)

PostPreview.defaultProps = {
  isSmall: false,
  series: null,
}

export default PostPreview
