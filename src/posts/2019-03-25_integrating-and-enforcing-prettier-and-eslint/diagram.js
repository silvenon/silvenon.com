// @flow
import React from 'react'
import classNames from 'classnames'
import styles from './diagram.module.css'

const WIDTH = 300
const HEIGHT = 460

type Props = {
  title: string,
  description: string,
  variant: 'overlap' | 'eslint' | 'prettier',
  side: 'left' | 'right',
}

function ESLintPrettierDiagram({ title, description, variant, side }: Props) {
  const eslint = (
    <g key="eslint" className={styles.eslint}>
      <circle cx="150" cy="150" r="150" fill="#463FD4" />
      <text
        dx="150"
        dy={variant === 'eslint' ? 160 : 100}
        textAnchor="middle"
        fill="currentColor"
      >
        ESLint
      </text>
    </g>
  )
  const prettier = (
    <g key="prettier" className={styles.prettier}>
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
    </g>
  )
  const intersection = (
    <g key="intersection" className={styles.intersection}>
      <path
        d="M23.121,230c26.585,-42.051 73.494,-70 126.879,-70c53.385,0 100.294,27.949 126.879,70c-26.585,42.051 -73.494,70 -126.879,70c-53.385,0 -100.294,-27.949 -126.879,-70Z"
        fill="#34219F"
      />
      <text dx="150" dy="235" textAnchor="middle" fill="currentColor">
        code formatting
      </text>
    </g>
  )

  return (
    <figure className={classNames(styles.container, styles[side])}>
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
    </figure>
  )
}

export default ESLintPrettierDiagram
