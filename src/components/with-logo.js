// @flow
import * as React from 'react'
import styled from 'react-emotion'
import Logo from './logo'

const Container = styled.div`
  align-self: stretch;
  display: flex;
  margin: 1rem 0;
`

const Text = styled.div`
  flex: 1 1 0%;
  display: flex;
  justify-content: center;
  ${props => props.theme.logoSize`
    padding-right: ${({ size }) => size};
  `};

  & > * {
    margin-bottom: 0 !important;
  }
`

type Props = {
  children: React.Node,
}

const WithLogo = ({ children, ...props }: Props) => (
  <Container {...props}>
    <Logo />
    <Text>{children}</Text>
  </Container>
)

export default WithLogo
