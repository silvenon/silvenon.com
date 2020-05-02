import React from 'react'
import Link from 'next/link'
import styled, { css } from 'styled-components'
import Meta from './meta'
import Date from './post-date'
import { H2, H3, A, OL } from './body'
import Icon from './icon'

const SeriesLabel = () => (
  <div
    css={css`
      display: flex;
      align-items: center;
      font-family: var(--alt-font-family);
      font-size: 0.8rem;
      text-transform: uppercase;
      color: ${(props) => props.theme.color.grey};

      @media ${(props) => props.theme.query.sm} {
        font-size: 1rem;
      }
    `}
  >
    <Icon
      id="stack"
      css={css`
        margin-right: 0.25rem;
        width: 1.5em;
      `}
    />
    <div
      css={css`
        transform: translateY(0.15em);
      `}
    >
      Series
    </div>
  </div>
)

const titleStyle = css`
  margin-bottom: 0.5rem;
`
const SmallerTitle = styled(H3)`
  ${titleStyle};
`
const BiggerTitle = styled(H2)`
  ${titleStyle};
`

type Props = {
  isSmall?: boolean
  title: string
  dateTime: string
  path: string
  series?: {
    title: string
    parts: Array<{
      title: string
      path: string
    }>
  }
  children?: React.ReactNode
}

const PostPreview = ({
  isSmall = false,
  path,
  title,
  dateTime,
  series,
  children,
}: Props) => {
  const Title = isSmall ? SmallerTitle : BiggerTitle
  return (
    <article>
      {series != null ? <SeriesLabel /> : null}
      <Title as="h1">
        <Link href={path} passHref>
          <A>{series != null ? series.title : title}</A>
        </Link>
      </Title>
      <Meta
        css={css`
          margin-bottom: 0.5rem;
          @media ${(props) => props.theme.query.sm} {
            margin-bottom: 1rem;
          }
        `}
      >
        <Date dateTime={dateTime} />
      </Meta>
      {children}
      <p
        css={css`
          margin-top: -0.5rem;
          font-family: var(--alt-font-family);
          @media ${(props) => props.theme.query.sm} {
            margin-top: -1rem;
          }
        `}
      >
        <Link href={path} passHref>
          <A
            css={css`
              margin-top: 0.5rem;
            `}
          >
            Read more →
          </A>
        </Link>
      </p>
      {series != null ? (
        <>
          <p
            css={css`
              margin-top: 0.5rem;
            `}
          >
            Parts of this series:
          </p>
          <OL>
            {series.parts.map(({ title, path }) => (
              <li key={path}>
                <Link href={path} passHref>
                  <A>{title}</A>
                </Link>
              </li>
            ))}
          </OL>
        </>
      ) : null}
    </article>
  )
}

export default PostPreview
