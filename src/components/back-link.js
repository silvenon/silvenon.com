// @flow
import * as React from 'react'
import styled from 'astroturf'
import { FaArrowLeft } from 'react-icons/fa'
import LinkBase from './link'

const Link = styled(LinkBase)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: color(var(--blue) a(15%));
  border-radius: 1rem;
  font-family: var(--alt-font-family);
  text-decoration: none;
  white-space: nowrap;
  &:hover,
  &:focus {
    text-decoration: none;
    background: color(var(--blue) a(25%));
  }
`

const Icon = styled(FaArrowLeft)`
  margin-right: 0.5rem;
`

type Props = {
  children: React.Node,
}

const BackLink = ({ children, ...props }: Props) => (
  <Link {...props}>
    <Icon />
    <div>{children}</div>
  </Link>
)

export default BackLink
