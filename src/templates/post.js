// @flow
import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Share as TwitterShare } from 'react-twitter-widgets'
import { DiscussionEmbed } from 'disqus-react'
import Layout from '../components/layout'
import Icon from '../components/icon'
import Spacer from '../components/spacer'
import Container from '../components/container'
import Header from '../components/header'
import { H1 } from '../components/body'
import Link from '../components/link'
import BackLink from '../components/back-link'
import Meta from '../components/meta'
import Date from '../components/date'
import Author from '../components/author'
import socialLinks from '../constants/social-links'
import { type Language } from '../language'
import styles from './post.module.css'

type Props = {
  location: {
    pathname: string,
  },
  pageContext: {
    readNext: ?{
      title: string,
      path: string,
    },
  },
  data: {
    site: {
      siteMetadata: {
        siteUrl: string,
        name: string,
        avatar: { id: string, aspectRatio: number },
        biography: { long: string },
      },
    },
    mdx: {
      fields: {
        date: string,
        slug: string,
        isDraft: boolean,
      },
      exports: {
        meta: {
          title: string,
          language: Language,
          lastModified: string,
        },
      },
      excerpt: string,
      code: {
        body: string,
      },
    },
  },
}

const Post = ({ location, pageContext, data }: Props) => {
  const { pathname } = location
  const { readNext } = pageContext
  const {
    site,
    mdx: {
      fields: { date, slug, isDraft },
      exports: {
        meta: { title, language, lastModified },
      },
      excerpt,
      code: { body },
    },
  } = data
  const { siteUrl, name, avatar, biography } = site.siteMetadata

  return (
    <Layout
      title={title}
      description={excerpt}
      pathname={pathname}
      language={language}
      article={{
        publishedTime: date,
        modifiedTime: lastModified !== '' ? lastModified : null,
        author: name,
        tags: [],
      }}
    >
      <Header>
        <Header.TopBar>
          <BackLink to="/blog">All posts</BackLink>
        </Header.TopBar>
        <H1 className={styles.title}>{title}</H1>
        <Meta className={styles.meta}>
          <div className={styles.metaRow}>
            <Icon id="user" className={styles.icon} />
            <div>{name}</div>
          </div>
          <div className={styles.metaRow}>
            <Icon id="calendar" className={styles.icon} />
            <div>
              <Date
                dateTime={date}
                lastModified={lastModified !== '' ? lastModified : null}
              />
            </div>
          </div>
        </Meta>
      </Header>
      <Container>
        <MDXRenderer>{body}</MDXRenderer>
        <div className={styles.twitterShare}>
          <TwitterShare
            url={`${siteUrl}${pathname}`}
            options={{ text: title, via: 'silvenon', size: 'large' }}
          />
        </div>
      </Container>
      <Author
        name={name}
        avatar={avatar}
        biography={biography.long}
        links={socialLinks}
      />
      <Container>
        {readNext != null ? (
          <p className={styles.nextPost}>
            <span>Read next → </span>
            <Link to={readNext.path}>{readNext.title}</Link>
          </p>
        ) : null}
        {isDraft ? null : (
          <div className={styles.disqus}>
            <DiscussionEmbed
              shortname="silvenon"
              config={{
                url: `${siteUrl}${pathname}`,
                identifier: slug,
                title,
              }}
            />
          </div>
        )}
      </Container>
      <Spacer />
    </Layout>
  )
}

export default Post

export const query = graphql`
  query PostQuery($id: String) {
    site {
      siteMetadata {
        siteUrl
        name
        avatar {
          id
          aspectRatio
        }
        biography {
          long
        }
      }
    }
    mdx(id: { eq: $id }) {
      fields {
        date
        slug
        isDraft
      }
      exports {
        meta {
          title
          language
          lastModified
        }
      }
      excerpt
      code {
        body
      }
    }
  }
`
