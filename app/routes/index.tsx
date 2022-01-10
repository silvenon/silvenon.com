import { json, useLoaderData, useLocation, Link } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import { Fragment, useState } from 'react'
import clsx from 'clsx'
import Search from '~/components/Search'
import { PostDate } from '~/components/Post'
import ProfilePhoto from '~/components/ProfilePhoto'
import Icon from '~/components/Icon'
import Prose from '~/components/Prose'
import { getAllPosts, StandalonePost, Series } from '~/utils/posts.server'
import { getMeta } from '~/utils/seo'
import { SITE_DESCRIPTION, author, socialLinks } from '~/consts'
import circuitBoard from '~/images/circuit-board.svg'

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts()
  return json(posts, 200)
}

export const meta: MetaFunction = () =>
  getMeta({
    title: author.name,
    description: SITE_DESCRIPTION,
  })

export default function Home() {
  const posts = useLoaderData<Array<StandalonePost | Series>>()
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  return (
    <>
      <section className="relative mt-4 mb-10 bg-purple-300 dark:bg-purple-800 border-t-2 border-b-2 border-purple-400 dark:border-purple-400 px-4">
        <div
          className="absolute inset-0 opacity-70 dark:opacity-30"
          style={{ backgroundImage: `url(${circuitBoard})` }}
        />
        <div className="relative -my-3.5 max-w-sm mx-auto text-center sm:max-w-xl sm:text-left lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
          <div className="bg-white dark:bg-gray-800 p-3 ring-2 ring-purple-400 rounded-lg sm:flex">
            <Prose className="p-3 pb-4 sm:order-2 sm:flex-1 sm:self-center lg:px-5 lg:py-3">
              <h1 className="!mb-0">{author.name}</h1>
              <p>
                {author.bio} <Link to="about">More about me →</Link>
              </p>
            </Prose>
            <div className="sm:order-1 sm:w-40">
              <div className="relative">
                <ProfilePhoto className="aspect-[4/2] sm:aspect-[4/5]" />
                <div className="absolute bottom-0 right-0 mr-0.5 flex sm:left-0 sm:justify-center">
                  {socialLinks.map((network) => (
                    <a
                      key={network.id}
                      title={network.name}
                      href={network.url}
                      target="_blank"
                      rel="noreferrer"
                      className={clsx(
                        'block mx-1 p-2 text-black bg-white rounded-t-md bg-opacity-50  hover:bg-opacity-100 hover:bg-white transition-colors duration-200 sm:mx-1.5',
                        'dark:bg-gray-800 dark:bg-opacity-50 dark:text-white dark:hover:bg-gray-800 dark:hover:bg-opacity-100',
                      )}
                    >
                      <span className="sr-only">{network.name}</span>
                      <Icon
                        icon={network.icon}
                        className="w-5 h-5 fill-current"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <main className="mt-6 px-4 sm:flex sm:justify-center md:pb-4">
        <div>
          <Search
            posts={posts}
            onOpen={() => setSearchOpen(true)}
            onClose={() => setSearchOpen(false)}
          />
          <Prose>
            <h2
              className={clsx(
                'transition-opacity duration-200',
                searchOpen && 'opacity-0',
              )}
            >
              Posts
            </h2>
            {posts.map((post, index) => {
              if ('parts' in post) {
                const series = post
                return (
                  <Fragment key={series.title}>
                    <article>
                      <h3>
                        <Link to={series.parts[0].pathname}>
                          {series.title}
                        </Link>
                      </h3>
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
                    <h3>
                      <Link to={post.pathname}>{post.title}</Link>
                    </h3>
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
        </div>
      </main>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Prose as="main" className="py-4">
      <h1>Error while rendering posts</h1>
      <p>{error.message}</p>
      <pre>
        <code>{error.stack}</code>
      </pre>
    </Prose>
  )
}
