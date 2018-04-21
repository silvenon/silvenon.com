import React from 'react'
import Link from 'gatsby-link'
import styled from 'react-emotion'

const Anchor = styled.a`
  cursor: pointer;
  display: block;
  margin-bottom: 1rem;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  opacity: 0.5;
  &:hover,
  &:focus {
    opacity: 1;
  }
`

export const GoHome = () => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <Link to="/">
    <Anchor>← Home</Anchor>
  </Link>
)
