// @flow
import * as React from 'react'
import styled from 'astroturf'
import { darken } from 'polished'

const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--color);
  border-radius: 0.5rem;
  font-family: var(--alt-font-family);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: #fff;
  text-decoration: none;
  &:hover,
  &:focus {
    background: var(--color-hover);
    color: #fff;
    text-decoration: none;
  }

  & > * + * {
    margin-left: 0.5rem;
  }
`

type Props = {
  color: string,
  style: ?{},
}

const Button = ({ color, style, ...props }: Props) => (
  <ButtonBase
    style={{
      '--color': color,
      '--color-hover': darken(0.15, color),
      ...style,
    }}
    {...props}
  />
)

Button.defaultProps = {
  style: null,
}

export default Button
