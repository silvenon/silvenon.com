import React from 'react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { css } from 'styled-components'
// @ts-ignore
import codegen from 'codegen.macro'
import * as Header from '../components/header'
import Container from '../components/container'
import Author from '../components/author'
import { H1 as Title, H2, A } from '../components/body'
import PostPreview from '../components/post-preview'
import Button from '../components/button'
import Icon from '../components/icon'
import { siteConfig, socialLinks } from '../lib/consts'
import { Post } from '../lib/types'

// eslint-disable-next-line prefer-const
let posts: Post[] = []
codegen.require('../../etc/codegen/post-imports', {
  fromDir: 'src/pages',
  limit: 1,
  noSequels: true,
})

const { Excerpt: LastPostExcerpt, ...lastPost } = posts[0]

const { title, name } = siteConfig

const Home = () => (
  <>
    <NextSeo titleTemplate="%s" title={name} />
    <Header.Root>
      <Header.TopBar>
        <Title>{title}</Title>
      </Header.TopBar>
    </Header.Root>
    <Author
      inColor
      hasLinks={false}
      lazy={false}
      css={css`
        margin: 1.5rem 0;
      `}
    />
    <Container>
      <H2>
        Latest from{' '}
        <Link href="/blog" passHref>
          <A>my blog</A>
        </Link>
        :
      </H2>
      <div
        css={css`
          margin-bottom: 2rem;
        `}
      >
        <PostPreview
          key={lastPost.path}
          isSmall
          path={lastPost.path}
          title={lastPost.frontmatter.title}
          dateTime={lastPost.frontmatter.published}
          series={lastPost.series}
        >
          <LastPostExcerpt />
        </PostPreview>
      </div>
      <H2>More about me:</H2>
      <ul
        css={css`
          display: flex;
          align-items: center;
          margin-bottom: 2rem;

          > * + * {
            margin-left: 1rem;
          }
        `}
      >
        {Object.values(socialLinks).map(({ name, url, color, iconId }) => (
          <li key={name}>
            <Button as="a" href={url} title={name} color={color}>
              <Icon id={iconId} />
              <span
                css={css`
                  display: none;
                  @media ${(props) => props.theme.query.sm} {
                    display: inline;
                  }
                `}
              >
                {name}
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </Container>
  </>
)

export default Home
