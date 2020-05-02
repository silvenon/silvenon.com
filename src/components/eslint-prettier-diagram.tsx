import React from 'react'
import styled, { css } from 'styled-components'

const WIDTH = 300
const HEIGHT = 460

type Variant = 'overlap' | 'eslint' | 'prettier'
type Side = 'left' | 'right'

const Figure = styled.figure<{ side: Side }>`
  margin-bottom: var(--spacing);
  font-family: var(--alt-font-family);
  color: #fff;

  svg {
    display: block;
    margin: 0 auto;
  }

  @media ${(props) => props.theme.query.sm} {
    ${(props) =>
      props.side === 'left' &&
      css`
        float: left;
        margin-right: var(--spacing);
      `}
    ${(props) =>
      props.side === 'right' &&
      css`
        float: right;
        margin-left: var(--spacing);
      `}
  }
`

const Group = styled.g<{ variant: Variant }>`
  ${(props) =>
    (props.variant === 'eslint' || props.variant === 'prettier') &&
    css`
      text {
        font-size: 2rem;
        font-weight: bold;
      }
    `}
  ${(props) =>
    props.variant === 'overlap' &&
    css`
      text {
        font-size: 1.25rem;
      }
    `}
`

type Props = {
  title: string
  description: string
  variant: Variant
  side: Side
}

const ESLintPrettierDiagram = ({
  title,
  description,
  variant,
  side,
}: Props) => {
  const eslint = (
    <Group key="eslint" variant={variant}>
      <circle cx="150" cy="150" r="150" fill="#463FD4" />
      <text
        dx="150"
        dy={variant === 'eslint' ? 160 : 100}
        textAnchor="middle"
        fill="currentColor"
      >
        ESLint
      </text>
    </Group>
  )
  const prettier = (
    <Group key="prettier" variant={variant}>
      {variant === 'prettier' ? (
        <circle cx="150" cy="310" r="160" fill="#fff" />
      ) : null}
      <circle cx="150" cy="310" r="150" fill="#BF85BF" />
      <text
        dx="150"
        dy={variant === 'prettier' ? 320 : 380}
        textAnchor="middle"
        fill="currentColor"
      >
        Prettier
      </text>
    </Group>
  )
  const intersection = (
    <Group key="intersection" variant={variant}>
      <path
        d="M23.121,230c26.585,-42.051 73.494,-70 126.879,-70c53.385,0 100.294,27.949 126.879,70c-26.585,42.051 -73.494,70 -126.879,70c-53.385,0 -100.294,-27.949 -126.879,-70Z"
        fill="#34219F"
      />
      <text dx="150" dy="235" textAnchor="middle" fill="currentColor">
        code formatting
      </text>
    </Group>
  )

  return (
    <Figure side={side}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH * 0.75}
        height={HEIGHT * 0.75}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <title>{title}</title>
        <desc>{description}</desc>
        {variant === 'overlap' ? [eslint, prettier, intersection] : null}
        {variant === 'eslint' ? [prettier, eslint] : null}
        {variant === 'prettier' ? [eslint, prettier] : null}
      </svg>
    </Figure>
  )
}

export default ESLintPrettierDiagram
