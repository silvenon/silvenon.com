// @flow
import * as React from 'react'
import styled, { css } from 'react-emotion'
import { darken } from 'polished'
import Link from './link'

const Container = styled.div`
  display: flex;
  justify-content: center;
  font-family: ${props => props.theme.fontFamily.alt};
`

const Inner = styled.div`
  display: flex;
  align-items: center;
  background: ${darken(0.1, '#fff')};
  border-radius: ${props => props.theme.borderRadius};
`

const navItem = css`
  display: block;
  width: 5rem;
  text-align: center;
  padding: 0.5rem 0;
`
const NavDisabled = styled.div`
  ${navItem};
  color: ${darken(0.35, '#fff')};
`
const NavLink = styled(Link)`
  ${navItem};
  ${({ side, theme }) => css`
    border-top-${side}-radius: ${theme.borderRadius};
    border-bottom-${side}-radius: ${theme.borderRadius};
    border-${side}: 0.25rem solid transparent;
    transition: border-color 0.2s;
    &:hover,
    &:focus {
      color: ${theme.colors.blueDark};
      border-${side}-color: ${theme.colors.blue};
    }
  `};
`
const Status = styled.div`
  margin: 0 1rem;
`

type Props = {
  page: number,
  total: number,
  prevLabel: string,
  prevPath: ?string,
  nextLabel: string,
  nextPath: ?string,
}

const Pager = ({
  page,
  total,
  prevLabel,
  prevPath,
  nextLabel,
  nextPath,
}: Props) => (
  <Container>
    <Inner>
      {prevPath != null ? (
        <NavLink to={prevPath} side="left">
          {prevLabel}
        </NavLink>
      ) : (
        <NavDisabled>{prevLabel}</NavDisabled>
      )}
      <Status>
        Page {page + 1} of {total}
      </Status>
      {nextPath != null ? (
        <NavLink to={nextPath} side="right">
          {nextLabel}
        </NavLink>
      ) : (
        <NavDisabled>{nextLabel}</NavDisabled>
      )}
    </Inner>
  </Container>
)

Pager.defaultProps = {
  prevLabel: 'Previous page',
  nextLabel: 'Next page',
}

export default Pager
