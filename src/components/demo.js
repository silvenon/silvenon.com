// @flow
import React from 'react'
import { Iframe } from './media'

type Props = {
  id: string,
}

const Demo = ({ id }: Props) => (
  <Iframe
    rounded={false}
    src={`https://codesandbox.io/embed/${id}`}
    title={id}
    width="100%"
    height="500"
    sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
  />
)

export default Demo
