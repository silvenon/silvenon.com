import { LoaderFunction, useLoaderData, useLocation, Link } from 'remix'
import { Fragment } from 'react'
import Prose from '~/components/Prose'
import { PostDate } from '~/components/Post'
import { getAllPosts, StandalonePost, Series } from '~/utils/posts.server'

type LoaderData = Array<StandalonePost | Series>

export const loader: LoaderFunction = (): Promise<LoaderData> => getAllPosts()

export default function PostList() {
  const posts = useLoaderData<LoaderData>()
  const location = useLocation()
  return (
    <Prose as="main" className="container py-4">
      <h1>Posts</h1>
      {posts.map((post, index) => {
        if ('parts' in post) {
          const series = post
          return (
            <Fragment key={series.title}>
              <article>
                <h2>
                  <Link to={series.parts[0].pathname}>{series.title}</Link>
                </h2>
                <PostDate published={series.published} />
                <p>{series.description}</p>
                <p>Parts of this series:</p>
                <ol>
                  {series.parts.map((part) => (
                    <li key={part.pathname}>
                      {part.pathname === location.pathname ? (
                        part.title
                      ) : (
                        <Link to={part.pathname}>{part.title}</Link>
                      )}
                    </li>
                  ))}
                </ol>
              </article>
              {index < posts.length - 1 ? <hr /> : null}
            </Fragment>
          )
        }

        return (
          <Fragment key={post.title}>
            <article>
              <h2>
                <Link to={post.pathname}>{post.title}</Link>
              </h2>
              <PostDate published={post.published} />
              <p>{post.description}</p>
              <p>
                <Link to={post.pathname}>Read more →</Link>
              </p>
            </article>
            {index < posts.length - 1 ? <hr /> : null}
          </Fragment>
        )
      })}
    </Prose>
  )
}
