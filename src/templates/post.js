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
import { H1, P, OL, LI, HR } from '../components/body'
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
      id: string,
      fields: {
        date: string,
        slug: string,
        isSeries: boolean,
        seriesTitle: ?string,
        isDraft: boolean,
      },
      exports: {
        meta: {
          seriesPart: ?number,
          title: string,
          language: Language,
          lastModified: string,
        },
      },
      excerpt: string,
      body: string,
    },
    seriesMdx: {
      edges: Array<{
        node: {
          id: string,
          fields: {
            path: string,
          },
          exports: {
            meta: {
              seriesPart: number,
              title: string,
            },
          },
        },
      }>,
    },
    readNextMdx: ?{
      fields: {
        path: string,
      },
      exports: {
        meta: {
          title: string,
        },
      },
    },
  },
}

const Post = ({ location, data }: Props) => {
  const { pathname } = location
  const {
    site,
    mdx: {
      id,
      fields: { date, slug, isSeries, seriesTitle, isDraft },
      exports: {
        meta: { seriesPart, title, language, lastModified },
      },
      excerpt,
      body,
    },
    seriesMdx,
    readNextMdx,
  } = data
  const { siteUrl, name, avatar, biography } = site.siteMetadata
  const fullTitle =
    isSeries != null && seriesTitle != null ? `${seriesTitle}: ${title}` : title

  return (
    <Layout
      title={fullTitle}
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
        <H1 className={styles.title}>
          {isSeries ? (
            <>
              <div>{seriesTitle}</div>
              <small className={styles.subtitle}>
                <span className={styles.seriesPart}>{`Part ${
                  seriesPart + 1
                }:`}</span>{' '}
                {title}
              </small>
            </>
          ) : (
            title
          )}
        </H1>
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
        {isSeries ? (
          <div className={styles.seriesParts}>
            <P>This post is part of the series "{seriesTitle}":</P>
            <OL>
              {seriesMdx.edges
                .map((edge) => ({
                  id: edge.node.id,
                  order: edge.node.exports.meta.seriesPart,
                  title: edge.node.exports.meta.title,
                  path: edge.node.fields.path,
                }))
                .sort((partA, partB) => partA.order - partB.order)
                .map((part) => (
                  <LI key={part.id}>
                    {part.id !== id ? (
                      <Link to={part.path}>{part.title}</Link>
                    ) : (
                      part.title
                    )}
                  </LI>
                ))}
            </OL>
            <HR />
          </div>
        ) : null}
        <MDXRenderer>{body}</MDXRenderer>
        <div className={styles.twitterShare}>
          <TwitterShare
            url={`${siteUrl}${pathname}`}
            options={{ text: fullTitle, via: 'silvenon', size: 'large' }}
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
        {readNextMdx != null ? (
          <p className={styles.nextPost}>
            <span>Read next → </span>
            <Link to={readNextMdx.fields.path}>
              {readNextMdx.exports.meta.title}
            </Link>
          </p>
        ) : null}
        {isDraft ? null : (
          <div className={styles.disqus}>
            <DiscussionEmbed
              shortname="silvenon"
              config={{
                url: `${siteUrl}${pathname}`,
                identifier: slug,
                title: fullTitle,
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
  query PostQuery($id: String, $seriesId: String, $readNextId: String) {
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
      id
      fields {
        date
        slug
        isSeries
        seriesTitle
        isDraft
      }
      exports {
        meta {
          seriesPart
          title
          language
          lastModified
        }
      }
      excerpt
      body
    }
    seriesMdx: allMdx(filter: { fields: { seriesId: { eq: $seriesId } } }) {
      edges {
        node {
          id
          fields {
            path
          }
          exports {
            meta {
              seriesPart
              title
            }
          }
        }
      }
    }
    readNextMdx: mdx(id: { eq: $readNextId }) {
      fields {
        path
      }
      exports {
        meta {
          title
        }
      }
    }
  }
`
