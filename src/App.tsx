import React from 'react'
import { Router } from '@reach/router'
import Home from './pages'
import NotFound from './pages/404'
import PostLayout from './components/PostLayout'
import { posts } from './posts'

interface Props {
  PostComponent?: React.ComponentType
  postHtmlContent?: string
}

export default function App({ PostComponent, postHtmlContent }: Props) {
  return (
    <Router>
      <NotFound default />
      <Home path="/" />
      {posts.map((post) => (
        <PostLayout
          key={post.pathname}
          path={post.pathname}
          StaticMDXComponent={PostComponent}
          htmlContent={postHtmlContent}
          {...post}
        />
      ))}
    </Router>
  )
}
