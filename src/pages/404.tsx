import React from 'react'
import Head from 'next/head'
import { css } from 'styled-components'
import Container from '../components/container'
import * as Header from '../components/header'
import { H1 as Title, P } from '../components/body'
import BackLink from '../components/back-link'
import Icon from '../components/icon'

const NotFoundPage = () => (
  <>
    <Head>
      <title key="title">Page Not Found</title>
      <meta
        key="description"
        name="description"
        content="This page no longer exists, but the content probably exists elsewhere on this site."
      />
    </Head>
    <Header.Root>
      <Header.TopBar>
        <BackLink href="/blog">Blog</BackLink>
      </Header.TopBar>
      <Title>Page Not Found</Title>
    </Header.Root>
    <Container>
      <div
        css={css`
          display: flex;
          justify-content: center;
          margin: 1rem 0 2rem;
        `}
      >
        <Icon
          id="exclamation-mark"
          size={96}
          css={css`
            fill: ${(props) => props.theme.color.red};
          `}
        />
      </div>
      <P>
        This page no longer exists. It's likely that you got here by following a
        link to my blog post which no longer has that URL. You should be able to
        find the content you're looking for elsewhere on this site.
      </P>
    </Container>
  </>
)

export default NotFoundPage
