// @flow
import React from 'react'
import { format } from 'date-fns'
import withClassNames from './with-class-names'
import styles from './date.module.css'

type Props = {
  dateTime: string,
  lastModified: ?string,
}

const Date = ({ dateTime, lastModified, ...props }: Props) => (
  <div>
    <time dateTime={dateTime} {...props}>
      {format(dateTime, 'MMMM Do, YYYY')}
    </time>
    {lastModified ? (
      <div className={styles.lastModified}>
        (Edited on {format(lastModified, 'MMMM Do, YYYY')})
      </div>
    ) : null}
  </div>
)

Date.defaultProps = {
  lastModified: null,
}

export default withClassNames(styles.time)(Date)
