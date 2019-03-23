// @flow
import React from 'react'
import { format } from 'date-fns'
import withClassNames from './with-class-names'
import styles from './date.module.css'

type Props = {
  dateTime: string,
}

const Date = (props: Props) => (
  <time {...props}>{format(props.dateTime, 'MMMM Do, YYYY')}</time>
)

export default withClassNames(styles.time)(Date)
