import styled from 'styled-components'
import { darken } from 'polished'

type Props = {
  color: string
}

const Button = styled.button<Props>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: ${(props) => props.color};
  border-radius: 0.5rem;
  font-family: var(--alt-font-family);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: #fff;
  text-decoration: none;
  &:hover,
  &:focus {
    background: ${(props) => darken(0.15, props.color)};
    color: #fff;
    text-decoration: none;
  }

  > * + * {
    margin-left: 0.5rem;
  }
`

export default Button
