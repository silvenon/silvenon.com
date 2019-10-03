// @flow
import React from 'react'
import { graphql } from 'gatsby'
import classNames from 'classnames'
import Layout from '../components/layout'
import Spacer from '../components/spacer'
import Container from '../components/container'
import Header from '../components/header'
import { H1 as Title } from '../components/body'
import PostPreview from '../components/post-preview'
import Pager from '../components/pager'
import Icon from '../components/icon'
import Link from '../components/link'
import { getSeries } from '../utils/post'
import { type Language, LANGUAGE, LANGUAGES } from '../language'
import styles from './blog.module.css'

type Props = {
  location: {
    pathname: string,
  },
  pageContext: {
    language?: Language,
    pageNumber: number,
    numberOfPages: number,
    previousPagePath: ?string,
    nextPagePath: ?string,
  },
  data: {
    pageMdx: {
      edges: Array<{
        node: {
          id: string,
          fields: {
            path: string,
            date: string,
            isSeries: boolean,
            seriesId: ?string,
            seriesTitle: ?string,
          },
          exports: {
            meta: {
              seriesPart: ?number,
              title: string,
            },
          },
          excerpt: string,
        },
      }>,
    },
    seriesMdx: {
      group: Array<{
        fieldValue: string,
        edges: Array<{
          node: {
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
      }>,
    },
  },
}

function Blog({
  location: { pathname },
  pageContext: {
    language,
    pageNumber,
    numberOfPages,
    previousPagePath,
    nextPagePath,
  },
  data: { pageMdx, seriesMdx },
}: Props) {
  return (
    <Layout
      title={language != null ? `Blog (${LANGUAGE[language].name})` : 'Blog'}
      description="Posts about frontend development, love and other topics"
      pathname={pathname}
    >
      <Header>
        <Header.TopBar>
          <Title>Blog</Title>
        </Header.TopBar>
        <div className={styles.filters} style={{ display: 'none' }}>
          <div className={styles.list}>
            {LANGUAGES.map(language => LANGUAGE[language]).map(({ id, name }) =>
              id === language ? (
                <div
                  key={id}
                  className={classNames(styles.item, styles.isActive)}
                >
                  <div className={styles.name}>{name}</div>
                  <Link to="/blog" className={styles.close}>
                    <Icon id="cross" size={24} />
                  </Link>
                </div>
              ) : (
                <Link
                  key={id}
                  to={`/blog/language/${id.toLowerCase()}`}
                  className={classNames(styles.item, styles.link)}
                >
                  <div className={styles.name}>{name}</div>
                </Link>
              ),
            )}
          </div>
          <div className={styles.state}>
            {language != null ? (
              <>
                Viewing posts in <strong>{LANGUAGE[language].name}</strong>
              </>
            ) : (
              <>
                Viewing <strong>all</strong> posts
              </>
            )}
          </div>
        </div>
      </Header>
      <Container>
        {pageMdx.edges
          .filter(edge =>
            edge.node.fields.isSeries
              ? edge.node.exports.meta.seriesPart === 0
              : true,
          )
          .reduce((acc, edge, i) => {
            const { id, excerpt } = edge.node
            const { path, date } = edge.node.fields
            const { title } = edge.node.exports.meta
            const post = (
              <PostPreview
                key={id}
                path={path}
                title={title}
                dateTime={date}
                excerpt={excerpt}
                series={getSeries(edge, seriesMdx)}
              />
            )
            if (i > 0) {
              const prevId = pageMdx.edges[i - 1].node.id
              const dividerKey = `${prevId}-${id}`
              return acc.concat(
                <div key={dividerKey} className={styles.divider} />,
                post,
              )
            }
            return acc.concat(post)
          }, [])}
      </Container>
      <Spacer />
      <Pager
        page={pageNumber}
        total={numberOfPages}
        prevLabel="Newer"
        prevPath={previousPagePath}
        nextLabel="Older"
        nextPath={nextPagePath}
      />
      <Spacer />
    </Layout>
  )
}

Blog.defaultProps = {
  pageContext: {
    language: null,
  },
}

export default Blog

export const query = graphql`
  query BlogQuery($language: String, $skip: Int!, $limit: Int!) {
    pageMdx: allMdx(
      sort: { fields: [fields___date], order: DESC }
      filter: {
        exports: {
          meta: { isHidden: { eq: false }, language: { eq: $language } }
        }
      }
      skip: $skip
      limit: $limit
    ) {
      edges {
        node {
          id
          fields {
            path
            date
            isSeries
            seriesId
            seriesTitle
          }
          exports {
            meta {
              seriesPart
              title
            }
          }
          excerpt
        }
      }
    }
    seriesMdx: allMdx {
      group(field: fields___seriesId) {
        fieldValue
        edges {
          node {
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
    }
  }
`
