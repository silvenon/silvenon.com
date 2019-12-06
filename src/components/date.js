// @flow
import React from 'react'
import { format } from 'date-fns'
import withClassNames from './with-class-names'
import styles from './date.module.css'

type Props = {
  dateTime: string,
  lastModified: ?string,
}

const DateComp = ({ dateTime, lastModified, ...props }: Props) => (
  <div>
    <time dateTime={dateTime} {...props}>
      {format(new Date(dateTime), 'MMMM do, yyyy')}
    </time>
    {lastModified ? (
      <div className={styles.lastModified}>
        (Edited on {format(new Date(lastModified), 'MMMM Do, yyyy')})
      </div>
    ) : null}
  </div>
)

DateComp.defaultProps = {
  lastModified: null,
}

export default withClassNames(styles.time)(DateComp)
