import React from 'react'
import styled, { css } from 'styled-components'
import Container from './container'
import Logo from './logo'
import useSearch from '../hooks/use-search'

const RootContainer = styled.header`
  position: relative;
  z-index: var(--z-header);
  text-align: center;
`
export const Root = ({ children }: { children?: React.ReactNode }) => (
  <RootContainer>
    <Container>{children}</Container>
  </RootContainer>
)

const TopBarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 1rem;
  align-items: center;
  height: 3rem;
  margin: 1rem 0;
  @media ${(props) => props.theme.query.sm} {
    height: 3.5rem;
  }
`
const Middle = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  > * {
    margin: 0 !important;
  }
  ${(props) =>
    !props.visible &&
    css`
      opacity: 0;
      transition: opacity var(--search-transition-duration);
      @media ${(props) => props.theme.query.sm} {
        opacity: 1;
      }
    `}
`
export const TopBar = ({ children }: { children?: React.ReactNode }) => {
  const search = useSearch()
  return (
    <TopBarContainer>
      <div>
        <Logo />
      </div>
      <Middle visible={!search.isActive}>{children}</Middle>
      <div>{search.node}</div>
    </TopBarContainer>
  )
}
