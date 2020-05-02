import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { Share as TwitterShare } from 'react-twitter-widgets'
import { css } from 'styled-components'
import Icon from './icon'
import Spacer from './spacer'
import Container from './container'
import * as Header from './header'
import { H1, P, A, OL, LI, HR } from './body'
import BackLink from './back-link'
import Meta from './meta'
import Date from './post-date'
import Author from './author'
import { siteConfig } from '../lib/consts'
import { PostLayoutComponent } from '../lib/types'

const { url: siteUrl, name } = siteConfig

const MetaRow = ({
  iconId,
  children,
}: {
  iconId: string
  children: React.ReactNode
}) => (
  <div
    css={css`
      display: flex;
    `}
  >
    <Icon
      id={iconId}
      css={css`
        margin-top: 0.25rem;
      `}
    />
    <div
      css={css`
        margin-left: 0.5rem;
      `}
    >
      {children}
    </div>
  </div>
)

const PostLayout: PostLayoutComponent = ({ frontmatter, series, children }) => {
  const { pathname } = useRouter()
  const { seriesPart, title, published, lastModified, tweet } = frontmatter
  const fullTitle = series != null ? `${series.title}: ${title}` : title
  const tweetUrl = tweet ?? series?.tweet
  const readNext =
    typeof series !== 'undefined' &&
    typeof seriesPart === 'number' &&
    seriesPart < series.parts.length - 1
      ? series.parts[seriesPart + 1]
      : undefined

  return (
    <>
      <NextSeo
        title={fullTitle}
        openGraph={{
          url: `${siteConfig.url}${pathname}`,
          type: 'article',
          article: {
            publishedTime: published,
            modifiedTime: lastModified,
            authors: [siteConfig.name],
          },
        }}
      />
      <Header.Root>
        <Header.TopBar>
          <BackLink href="/blog">All posts</BackLink>
        </Header.TopBar>
        <H1
          css={css`
            margin-bottom: 0;
            color: #000;
          `}
        >
          {typeof series !== 'undefined' && typeof seriesPart === 'number' ? (
            <>
              <div>{series.title}</div>
              <small
                css={css`
                  display: block;
                  font-weight: 600;
                  font-size: 0.75em;
                `}
              >
                <span>{`Part ${seriesPart + 1}:`}</span> {title}
              </small>
            </>
          ) : (
            title
          )}
        </H1>
        <Meta
          css={css`
            margin: 0.5rem 1rem 1rem;
            display: inline-block;
            text-align: left;
          `}
        >
          <MetaRow iconId="user">{name}</MetaRow>
          <MetaRow iconId="calendar">
            <Date dateTime={published} lastModified={lastModified} />
          </MetaRow>
        </Meta>
      </Header.Root>
      <Container>
        {typeof series !== 'undefined' ? (
          <div
            css={css`
              color: ${(props) => props.theme.color.grey};
            `}
          >
            <P>This post is part of the series "{series.title}":</P>
            <OL>
              {series.parts.map((part) => (
                <LI key={part.path}>
                  {part.path !== pathname ? (
                    <Link href={part.path} passHref>
                      <A>{part.title}</A>
                    </Link>
                  ) : (
                    part.title
                  )}
                </LI>
              ))}
            </OL>
            <HR />
          </div>
        ) : null}
        {children}
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: calc(var(--spacing) * 2);
            margin-bottom: var(--spacing);
          `}
        >
          <TwitterShare
            url={`${siteUrl}${pathname}`}
            options={{ text: fullTitle, via: 'silvenon', size: 'large' }}
          />
          {typeof tweetUrl !== 'undefined' ? (
            <div>
              <A
                target="_blank"
                href={tweetUrl}
                css={css`
                  padding: 0.5rem;
                `}
              >
                <Icon id="discussion" /> Discuss on Twitter
              </A>
            </div>
          ) : null}
        </div>
        <div>
          <Link href="/blog" passHref>
            <A>← All posts</A>
          </Link>
        </div>
      </Container>
      <Author />
      <Container>
        {typeof readNext !== 'undefined' ? (
          <p
            css={css`
              color: ${(props) => props.theme.color.grey};
            `}
          >
            <span>Read next → </span>
            <Link href={readNext.path} passHref>
              <A>{readNext.title}</A>
            </Link>
          </p>
        ) : null}
      </Container>
      <Spacer />
    </>
  )
}

export default PostLayout
