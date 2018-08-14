// @flow
import * as React from 'react'
import styled from 'react-emotion'
import { format } from 'date-fns'

type Props = {
  dateTime: string,
}

const Time = styled.time`
  display: block;
`

const Date = ({ dateTime }: Props) => (
  <Time dateTime={dateTime}>{format(dateTime, 'MMMM Do, YYYY')}</Time>
)

export default Date
