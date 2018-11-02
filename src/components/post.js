// @flow
import * as React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import { Share as TwitterShare } from 'react-twitter-widgets'
import { FaUser, FaCalendarAlt } from 'react-icons/fa'
import { DiscussionEmbed } from 'disqus-react'
import Layout from './layout'
import Spacer from './spacer'
import Container from './container'
import Header from './header'
import { H1 } from './body'
import Link from './link'
import BackLink from './back-link'
import Meta from './meta'
import Date from './date'
import Author from './author'
import socialLinks from '../constants/social-links'
import styles from './post.module.css'

type Props = {
  children: React.Node,
  location: {
    pathname: string,
  },
  pageContext: {
    node: {
      fields: {
        date: string,
        slug: string,
        isDraft: boolean,
      },
      exports: {
        meta: {
          title: string,
          lang: string,
          lastModified: string,
        },
      },
      excerpt: string,
    },
    readNext: ?{
      title: string,
      path: string,
    },
  },
}

const Post = ({ children, location, pageContext }: Props) => {
  const { pathname } = location
  const {
    node: {
      fields: { date, slug, isDraft },
      exports: {
        meta: { title, lang, lastModified },
      },
      excerpt,
    },
    readNext,
  } = pageContext
  return (
    <StaticQuery
      query={graphql`
        query PostQuery {
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
        }
      `}
      render={({
        site: {
          siteMetadata: { siteUrl, name, avatar, biography },
        },
      }: {
        site: {
          siteMetadata: {
            siteUrl: string,
            name: string,
            avatar: { id: string, aspectRatio: number },
            biography: { long: string },
          },
        },
      }) => (
        <Layout
          title={title}
          description={excerpt}
          pathname={pathname}
          lang={lang}
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
                <FaUser />
                <div>{name}</div>
              </div>
              <div className={styles.metaRow}>
                <FaCalendarAlt />
                <Date dateTime={date} />
              </div>
            </Meta>
          </Header>
          <Container>
            {children}
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
      )}
    />
  )
}

export default Post
