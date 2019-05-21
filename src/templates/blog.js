// @flow
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Spacer from '../components/spacer'
import Container from '../components/container'
import Header from '../components/header'
import { H1 as Title } from '../components/body'
import Filters from '../components/filters'
import PostPreview from '../components/post-preview'
import Pager from '../components/pager'
import * as CATEGORY from '../constants/categories'
import styles from './blog.module.css'

type Props = {
  location: {
    pathname: string,
  },
  pageContext: {
    category: $Keys<typeof CATEGORY>,
    pageNumber: *,
    numberOfPages: *,
    previousPagePath: *,
    nextPagePath: *,
  },
  data: {
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

const Blog = ({
  location: { pathname },
  pageContext: {
    category,
    pageNumber,
    numberOfPages,
    previousPagePath,
    nextPagePath,
  },
  data: {
    allMdx: { edges },
  },
}: Props) => (
  <Layout
    title={category != null ? `Blog (${CATEGORY[category].name})` : 'Blog'}
    description="Posts about frontend development, love and other topics"
    pathname={pathname}
  >
    <Header>
      <Header.TopBar>
        <Title>Blog</Title>
      </Header.TopBar>
      <Filters
        basePath="/blog"
        currentPath={category != null ? CATEGORY[category].path : null}
        items={['DEV', 'NON_DEV'].map(category => CATEGORY[category])}
        closePath="/blog"
      />
    </Header>
    <Container>
      {edges.reduce((acc, edge, i) => {
        const {
          fields: { path, date },
          exports: {
            meta: { title },
          },
          excerpt,
        } = edge.node
        const post = (
          <PostPreview
            key={path}
            path={path}
            title={title}
            dateTime={date}
            excerpt={excerpt}
          />
        )
        if (i > 0) {
          const prevPath = edges[i - 1].node.fields.path
          const dividerKey = `${prevPath}-${path}`
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

Blog.defaultProps = {
  pageContext: {
    category: null,
  },
}

export default Blog

export const query = graphql`
  query BlogQuery($category: String, $skip: Int!, $limit: Int!) {
    allMdx(
      sort: { fields: [fields___date], order: DESC }
      filter: {
        exports: {
          meta: { isHidden: { eq: false }, category: { eq: $category } }
        }
      }
      skip: $skip
      limit: $limit
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
