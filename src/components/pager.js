// @flow
import * as React from 'react'
import styled, { css } from 'astroturf'
import Link from './link'

const Container = styled.div`
  display: flex;
  justify-content: center;
  font-family: var(--alt-font-family);
`

const Inner = styled.div`
  display: flex;
  align-items: center;
  background: color(#fff shade(10%));
  border-radius: var(--border-radius);
`

// eslint-disable-next-line no-unused-vars
const styles = css`
  .base {
    display: block;
    width: 5rem;
    text-align: center;
    padding: 0.5rem 0;
  }
`

const NavLink = styled(Link)`
  composes: base from './pager-styles.module.css';
  &.left {
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
    border-left: 0.25rem solid transparent;
    transition: border-color 0.2s;
    &:hover,
    &:focus {
      color: var(--blue-dark);
      border-left-color: var(--blue);
    }
  }
  &.right {
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-right: 0.25rem solid transparent;
    transition: border-color 0.2s;
    &:hover,
    &:focus {
      color: var(--blue-dark);
      border-right-color: var(--blue);
    }
  }
`

const NavDisabled = styled.div`
  composes: base from './pager-styles.module.css';
  color: color(#fff shade(35%));
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
        <NavLink to={prevPath} left>
          {prevLabel}
        </NavLink>
      ) : (
        <NavDisabled>{prevLabel}</NavDisabled>
      )}
      <Status>
        Page {page + 1} of {total}
      </Status>
      {nextPath != null ? (
        <NavLink to={nextPath} right>
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
