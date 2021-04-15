import React from 'react'
import type { SeriesPart } from '../posts'

interface Props {
  parts: SeriesPart[]
  pathname?: string
}

export default function SeriesParts({ parts, pathname }: Props) {
  return (
    <>
      <p>Parts of this series:</p>
      <ol>
        {parts.map((part) => (
          <li key={part.pathname}>
            {part.pathname === pathname ? (
              part.title
            ) : (
              <a href={part.pathname}>{part.title}</a>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}
