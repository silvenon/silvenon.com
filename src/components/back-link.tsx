import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { tint } from 'polished'
import Icon from './icon'
import { A } from './body'

const Anchor = styled(A)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => tint(0.75, props.theme.color.blue)};
  border-radius: 1rem;
  font-family: var(--alt-font-family);
  text-decoration: none;
  white-space: nowrap;
  &:hover,
  &:focus {
    text-decoration: none;
    background: ${(props) => tint(0.9, props.theme.color.blue)};
    border-color: ${(props) => tint(0.25, props.theme.color.blueDark)};
  }
`

const LinkIcon = styled(Icon)`
  margin-right: 0.5rem;
`

type Props = {
  href: string
  className?: string
  children?: React.ReactNode
}

const BackLink = ({ href, children, ...props }: Props) => (
  <Link href={href} passHref>
    <Anchor {...props}>
      <LinkIcon id="arrow-left" size={20} />
      <div>{children}</div>
    </Anchor>
  </Link>
)

export default BackLink
