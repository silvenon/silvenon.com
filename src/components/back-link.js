// @flow
import * as React from 'react'
import styled from 'react-emotion'
import { transparentize } from 'polished'
import { FaArrowLeft } from 'react-icons/fa'
import LinkBase from './link'

const Link = styled(LinkBase)`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background: ${props => transparentize(0.85, props.theme.colors.blue)};
  border-radius: 1rem;
  font-family: ${props => props.theme.fontFamily.alt};
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: none;
    background: ${props => transparentize(0.75, props.theme.colors.blue)};
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
