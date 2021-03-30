import React from 'react'
import { Router } from '@reach/router'
import Home from './pages'
import NotFound from './pages/404'
import PostLayout from './components/PostLayout'
import { posts } from './posts'

interface Props {
  BlogPost?: React.ComponentType
}

export default function App({ BlogPost }: Props) {
  return (
    <Router>
      <NotFound default />
      <Home path="/" />
      {posts.map((post) => (
        <PostLayout
          key={post.pathname}
          path={post.pathname}
          StaticMDXComponent={BlogPost}
          {...post}
        />
      ))}
    </Router>
  )
}
