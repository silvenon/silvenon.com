import React from 'react'
import Link from 'next/link'
import styled from 'react-emotion/macro'

const Anchor = styled('a')`
  cursor: pointer;
  display: block;
  margin-bottom: 1rem;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  opacity: 0.5;
  &:hover, &:focus {
    opacity: 1;
  }
`

export const GoHome = () =>
  <Link
    prefetch
    href="/"
  >
    <Anchor>
      ← Home
    </Anchor>
  </Link>
