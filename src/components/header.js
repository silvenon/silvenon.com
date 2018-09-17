// @flow
import * as React from 'react'
import styled from 'react-emotion'
import Container from './container'
import Logo from './logo'
import Search from './search'

const HeaderContainer = styled.header`
  text-align: center;
`

const TopBarContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  align-items: center;
  height: 3rem;
  margin: 1rem 0;
  ${props => props.theme.mqMin.sm} {
    height: 3.5rem;
  }
`

const Left = styled.div``
const Middle = styled.div`
  display: flex;
  justify-content: center;
  > * {
    margin: 0 !important;
  }
`
const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`

type Props = {
  children: React.Node,
}

const Header = ({ children }: Props) => (
  <HeaderContainer>
    <Container>{children}</Container>
  </HeaderContainer>
)

Header.TopBar = ({ children }: { children: React.Element<any> }) => (
  <TopBarContainer>
    <Left>
      <Logo />
    </Left>
    <Middle>{children}</Middle>
    <Right>
      <Search />
    </Right>
  </TopBarContainer>
)

export default Header
