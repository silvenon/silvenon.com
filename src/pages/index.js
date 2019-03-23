// @flow
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Header from '../components/header'
import Container from '../components/container'
import Author from '../components/author'
import { H1 as Title, H2 } from '../components/body'
import Link from '../components/link'
import PostPreview from '../components/post-preview'
import Button from '../components/button'
import socialLinks from '../constants/social-links'
import styles from './index.module.css'

type Props = {
  location: {
    pathname: string,
  },
  data: {
    site: {
      siteMetadata: {
        siteUrl: string,
        name: string,
        avatar: {
          id: string,
          aspectRatio: number,
        },
        biography: {
          short: string,
          long: string,
        },
      },
    },
    allMdx: {
      edges: Array<{
        node: {
          fields: {
            path: string,
            date: string,
          },
          exports: {
            meta: {
              title: string,
            },
          },
          excerpt: string,
        },
      }>,
    },
  },
}

const Home = ({
  location: { pathname },
  data: {
    site: {
      siteMetadata: { name, avatar, biography },
    },
    allMdx: { edges },
  },
}: Props) => (
  <Layout
    title={name}
    description={biography.short}
    pathname={pathname}
    image={{ ...avatar, alt: 'avatar' }}
  >
    <Header>
      <Header.TopBar>
        <Title>Silvenon</Title>
      </Header.TopBar>
    </Header>
    <Author
      inColor
      lazy={false}
      name={name}
      avatar={avatar}
      biography={biography.long}
      className={styles.author}
    />
    <Container>
      <H2>
        Latest from <Link to="/blog">my blog</Link>:
      </H2>
      <div className={styles.blog}>
        {edges.map(
          ({
            node: {
              fields: { path, date },
              exports: {
                meta: { title },
              },
              excerpt,
            },
          }) => (
            <PostPreview
              key={path}
              isSmall
              path={path}
              title={title}
              dateTime={date}
              excerpt={excerpt}
            />
          ),
        )}
      </div>
      <H2>More about me:</H2>
      <ul className={styles.buttonList}>
        {/* $FlowFixMe */}
        {Object.values(socialLinks).map(({ name, url, color, Icon }) => (
          <li key={name}>
            <Button as="a" href={url} title={name} color={color}>
              <Icon />
              <span className={styles.buttonLabel}>{name}</span>
            </Button>
          </li>
        ))}
      </ul>
    </Container>
  </Layout>
)

export const query = graphql`
  query HomeQuery {
    site {
      siteMetadata {
        siteUrl
        name
        avatar {
          id
          aspectRatio
        }
        biography {
          short
          long
        }
      }
    }
    allMdx(
      sort: { order: DESC, fields: [fields___date] }
      filter: { exports: { meta: { lang: { eq: "EN" } } } }
      limit: 1
    ) {
      edges {
        node {
          fields {
            path
            date
          }
          exports {
            meta {
              title
            }
          }
          excerpt
        }
      }
    }
  }
`

export default Home
