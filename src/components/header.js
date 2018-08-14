// @flow
import * as React from 'react'
import styled from 'react-emotion'
import Inner from './container'

const Container = styled.header`
  text-align: center;
`

type Props = {
  children: React.Node,
}

const Header = ({ children }: Props) => (
  <Container>
    <Inner>{children}</Inner>
  </Container>
)

export default Header
