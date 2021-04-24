import React from 'react'
import { Router } from '@reach/router'
import Post from './components/Post'
import { posts } from './posts'

const pages = import.meta.globEager('/src/pages/*')

interface Props {
  PostComponent?: React.ComponentType
}

export default function App({ PostComponent }: Props) {
  return (
    <Router>
      {Object.entries(pages).map(([importPath, { default: Component }]) =>
        importPath.includes('404') ? (
          <Component key={importPath} default />
        ) : (
          <Component
            key={importPath}
            path={
              importPath.endsWith('index.tsx')
                ? '/'
                : importPath.replace(/src\/pages\/([a-z-]+)\.[a-z]+$/, '$1')
            }
          />
        ),
      )}
      {posts.map((post) => (
        <Post
          key={post.pathname}
          path={post.pathname}
          StaticMDXComponent={PostComponent}
          {...post}
        />
      ))}
    </Router>
  )
}
