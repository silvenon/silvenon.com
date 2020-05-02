import React from 'react'
import { NextSeo } from 'next-seo'
import { css } from 'styled-components'
// @ts-ignore
import codegen from 'codegen.macro'
import Spacer from '../components/spacer'
import Container from '../components/container'
import * as Header from '../components/header'
import { H1 as Title } from '../components/body'
import PostPreview from '../components/post-preview'
import { Post } from '../lib/types'

// eslint-disable-next-line prefer-const
let posts: Post[] = []
codegen.require('../../etc/codegen/post-imports', {
  fromDir: 'src/pages',
  noSequels: true,
})

const Blog = () => {
  return (
    <>
      <NextSeo
        title="Blog"
        description="Posts about frontend development, love and other topics"
      />
      <Header.Root>
        <Header.TopBar>
          <Title>Blog</Title>
        </Header.TopBar>
      </Header.Root>
      <Container>
        {posts
          .filter(
            ({ frontmatter }) =>
              typeof frontmatter.seriesPart !== 'number' ||
              frontmatter.seriesPart === 0,
          )
          .map(({ frontmatter, path, series, Excerpt }, index) => (
            <React.Fragment key={path}>
              {index > 0 ? (
                <div
                  css={css`
                    margin: 2rem 0;
                  `}
                />
              ) : null}
              <PostPreview
                title={frontmatter.title}
                dateTime={frontmatter.published}
                path={path}
                series={series}
              >
                <Excerpt />
              </PostPreview>
            </React.Fragment>
          ))}
      </Container>
      <Spacer />
    </>
  )
}

export default Blog
