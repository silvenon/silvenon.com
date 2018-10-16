// @flow
import * as React from 'react'
import styled from 'astroturf'
import Container from './container'
import Logo from './logo'
import Search from './search'

const HeaderContainer = styled.header`
  position: relative;
  z-index: var(--z-header);
  text-align: center;
`

const TopBarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 1rem;
  align-items: center;
  height: 3rem;
  margin: 1rem 0;
  @media (--min-small) {
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
const Right = styled.div``

type Props = {
  children: React.Node,
}

const Header = ({ children }: Props) => (
  <HeaderContainer>
    <Container>{children}</Container>
  </HeaderContainer>
)

Header.TopBar = ({ children }: { children: React.Element<any> }) => (
  <Search>
    {({ searchBar, styleHide }) => (
      <TopBarContainer>
        <Left>
          <Logo />
        </Left>
        <Middle className={styleHide}>{children}</Middle>
        <Right>{searchBar}</Right>
      </TopBarContainer>
    )}
  </Search>
)

export default Header
