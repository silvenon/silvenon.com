import React from 'react'
import { format } from 'date-fns'
import styled from 'styled-components'

const Time = styled.time`
  display: block;
`

type Props = {
  dateTime: string
  lastModified?: string
}

const PostDate = ({ dateTime, lastModified, ...props }: Props) => (
  <div>
    <Time {...props} dateTime={dateTime}>
      {format(new Date(dateTime), 'MMMM do, yyyy')}
    </Time>
    {lastModified ? (
      <div>(Edited on {format(new Date(lastModified), 'MMMM Do, yyyy')})</div>
    ) : null}
  </div>
)

export default PostDate
