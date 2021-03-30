import React from 'react'

const WIDTH = 300
const HEIGHT = 460

type Variant = 'overlap' | 'eslint' | 'prettier'

interface Props {
  title: string
  description: string
  variant: Variant
}

export default function ESLintPrettierDiagram({
  title,
  description,
  variant,
}: Props) {
  const eslint = (
    <g className="text-3xl font-bold">
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
    <g className="text-3xl font-bold">
      {variant === 'prettier' && (
        <circle
          className="fill-current text-white dark:text-gray-900"
          cx="150"
          cy="310"
          r="170"
        />
      )}
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
    <g>
      <path
        d="M23.121,230c26.585,-42.051 73.494,-70 126.879,-70c53.385,0 100.294,27.949 126.879,70c-26.585,42.051 -73.494,70 -126.879,70c-53.385,0 -100.294,-27.949 -126.879,-70Z"
        fill="#34219F"
      />
      <text
        className="text-2xl"
        dx="150"
        dy="235"
        textAnchor="middle"
        fill="currentColor"
      >
        code formatting
      </text>
    </g>
  )

  return (
    <figure className="sm:float-right sm:ml-4">
      <svg
        className="mx-auto text-white"
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH * 0.75}
        height={HEIGHT * 0.75}
      >
        <title>{title}</title>
        <desc>{description}</desc>
        {variant === 'overlap' && (
          <>
            {eslint}
            {prettier}
            {intersection}
          </>
        )}
        {variant === 'eslint' && (
          <>
            {prettier}
            {eslint}
          </>
        )}
        {variant === 'prettier' && (
          <>
            {eslint}
            {prettier}
          </>
        )}
      </svg>
    </figure>
  )
}
