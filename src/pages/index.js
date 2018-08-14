// @flow
import * as React from 'react'
import { graphql } from 'gatsby'
import styled from 'react-emotion'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import Layout from '../components/layout'
import Header from '../components/header'
import WithLogo from '../components/with-logo'
import Container from '../components/container'
import AuthorBase from '../components/author'
import { H1 as Title, H2, A } from '../components/body'
import Link from '../components/link'
import PostPreview from '../components/post-preview'
import Button from '../components/button'
import GitHubCorner from '../components/github-corner'
import ButtonLinks from '../constants/social-links'

const Author = styled(AuthorBase)`
  margin: 1.5rem 0;
`

const Blog = styled.div`
  margin-bottom: 2rem;
`

const ButtonList = styled.ul`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;

  & > * + * {
    margin-left: 1rem;
  }
`

const ButtonLink = Button.withComponent(A)

type Props = {
  data: {
    site: {
      siteMetadata: {
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
    image={{ ...avatar, alt: 'avatar' }}
  >
    <Header>
      <WithLogo>
        <Title>Silvenon</Title>
      </WithLogo>
    </Header>
    <Author inColor name={name} avatar={avatar} biography={biography.long} />
    <Container>
      <H2>
        Latest from <Link to="/blog">my blog</Link>:
      </H2>
      <Blog>
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
      </Blog>
      <H2>More about me:</H2>
      <ButtonList>
        <li>
          <ButtonLink
            href={ButtonLinks.gitHub.url}
            title={ButtonLinks.gitHub.name}
            color={ButtonLinks.gitHub.color}
          >
            <FaGithub />
            <div>GitHub</div>
          </ButtonLink>
        </li>
        <li>
          <ButtonLink
            href={ButtonLinks.linkedIn.url}
            title={ButtonLinks.linkedIn.name}
            color={ButtonLinks.linkedIn.color}
          >
            <FaLinkedin />
            <div>LinkedIn</div>
          </ButtonLink>
        </li>
        <li>
          <ButtonLink
            href={ButtonLinks.twitter.url}
            title={ButtonLinks.twitter.name}
            color={ButtonLinks.twitter.color}
          >
            <FaTwitter />
            <div>Twitter</div>
          </ButtonLink>
        </li>
      </ButtonList>
    </Container>
    <GitHubCorner />
  </Layout>
)

export const query = graphql`
  query HomeQuery {
    site {
      siteMetadata {
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
