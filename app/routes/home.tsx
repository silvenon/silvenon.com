import { data, Link, Await } from 'react-router'
import { Fragment, Suspense } from 'react'
import PostDate from '~/components/PostDate'
import ProfilePhoto from '~/components/ProfilePhoto'
import Prose from '~/components/Prose'
import { getMeta } from '~/utils/seo'
import { getAllPostsMeta } from '~/utils/posts.server'
import { author, socialLinks } from '~/consts'
import circuitBoard from '~/images/circuit-board.svg'
import spriteUrl from '~/sprite.svg'
import clsx from 'clsx'
import type { Route } from './+types/home'

export function loader(_: Route.LoaderArgs) {
  return data(
    { entries: getAllPostsMeta() },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  const cacheControl = loaderHeaders.get('Cache-Control')
  const result = new Headers()
  if (cacheControl) result.set('Cache-Control', cacheControl)
  return result
}

export function meta(_: Route.MetaArgs) {
  return getMeta({
    type: 'website',
    title: author.name,
    description: `Matija Marohnić is a frontend developer from Croatia, he enjoys exploring latest tech. Read this blog to learn about React, frontend tools, testing, and more!`,
    image: {
      publicId: 'in-reactor-1.jpg',
      alt: 'a photo of Matija Marohnić',
      version: 3,
      gravity: 'face',
    },
  })
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <section className="relative mb-10 mt-4 border-b-2 border-t-2 border-purple-400 bg-purple-300 px-4 dark:border-purple-400 dark:bg-purple-800">
        <div
          className="absolute inset-0 opacity-70 dark:opacity-30"
          style={{ backgroundImage: `url("${circuitBoard}")` }}
        />
        <div className="relative -my-3.5 mx-auto max-w-sm text-center sm:max-w-xl sm:text-left lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
          <div className="rounded-lg bg-white p-3 ring-2 ring-purple-400 dark:bg-gray-800 sm:flex">
            <Prose className="p-3 pb-4 sm:order-2 sm:flex-1 sm:self-center lg:px-5 lg:py-3">
              <h1 className="!mb-0">{author.name}</h1>
              <p>{author.bio}</p>
            </Prose>
            <div className="sm:order-1 sm:w-40">
              <ProfilePhoto />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 items-center justify-center sm:ml-4 sm:justify-start sm:pl-40 lg:ml-5 2xl:justify-end 2xl:pr-4">
            {socialLinks.map((network) => (
              <a
                key={network.name}
                title={network.name}
                href={network.url}
                target="_blank"
                rel="noreferrer"
                className="group block p-3 sm:p-2"
              >
                <span className="sr-only">{network.name}</span>
                <span
                  className={clsx(
                    'block rounded-full border-2 border-transparent bg-purple-400 p-1.5 text-white transition duration-200 group-hover:scale-125 group-hover:text-white dark:bg-purple-400 dark:text-black dark:group-hover:border-white dark:group-hover:shadow sm:p-2',
                    network.name === 'GitHub' && 'group-hover:bg-github',
                    network.name === 'Bluesky' && 'group-hover:bg-bluesky',
                    network.name === 'LinkedIn' && 'group-hover:bg-linkedin',
                  )}
                >
                  <svg aria-hidden="true" className="h-5 w-5 lg:h-6 lg:w-6">
                    <use href={`${spriteUrl}#${network.icon}`} />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <main className="mt-6 md:pb-4">
        <Prose>
          <h2>Posts</h2>
          <Suspense
            fallback={<div aria-label="Loading" className="loader pl-2" />}
          >
            <Await resolve={loaderData.entries}>
              {(entries) =>
                entries.map((entry, index) => {
                  const rule = index < entries.length - 1 ? <hr /> : null

                  if ('source' in entry) {
                    if ('parts' in entry) {
                      const externalSeries = entry
                      return (
                        <Fragment key={externalSeries.title}>
                          <article>
                            <h3>{externalSeries.title}</h3>
                            <PostDate
                              published={externalSeries.parts[0].published}
                            />
                            <p>{externalSeries.description}</p>
                            <p>Parts of this series:</p>
                            <ol>
                              {externalSeries.parts.map((part) => (
                                <li key={part.title} className="space-x-2">
                                  <span className="dark:text-white">
                                    {part.title}
                                  </span>
                                  <span>·</span>
                                  <a
                                    href={part.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center space-x-2"
                                  >
                                    <span>Read on {externalSeries.source}</span>
                                    <svg aria-hidden="true" className="h-6 w-6">
                                      <use href={`${spriteUrl}#external`} />
                                    </svg>
                                  </a>
                                </li>
                              ))}
                            </ol>
                          </article>
                          {rule}
                        </Fragment>
                      )
                    }

                    const externalPost = entry
                    return (
                      <Fragment key={externalPost.title}>
                        <article>
                          <h3>
                            <a
                              href={externalPost.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {externalPost.title}
                            </a>
                          </h3>
                          <PostDate published={externalPost.published} />
                          <p>{externalPost.description}</p>
                          <p>
                            <a
                              href={externalPost.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-2"
                            >
                              <span>Read on {externalPost.source}</span>
                              <svg aria-hidden="true" className="h-6 w-6">
                                <use href={`${spriteUrl}#external`} />
                              </svg>
                            </a>
                          </p>
                        </article>
                        {rule}
                      </Fragment>
                    )
                  }

                  if ('parts' in entry) {
                    const series = entry
                    return (
                      <Fragment key={series.slug}>
                        <article>
                          <h3>
                            <Link
                              to={`/blog/${series.slug}/${series.parts[0].slug}`}
                            >
                              {series.title}
                            </Link>
                          </h3>
                          <PostDate published={series.published ?? undefined} />
                          <p>{series.description}</p>
                          <p>Parts of this series:</p>
                          <ol>
                            {series.parts.map((part) => (
                              <li key={part.slug}>
                                <Link to={`/blog/${series.slug}/${part.slug}`}>
                                  {part.title}
                                </Link>
                              </li>
                            ))}
                          </ol>
                        </article>
                        {rule}
                      </Fragment>
                    )
                  }

                  const post = entry
                  return (
                    <Fragment key={post.slug}>
                      <article>
                        <h3>
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <PostDate published={post.published ?? undefined} />
                        <p>{post.description}</p>
                        <p>
                          <Link to={`/blog/${post.slug}`}>Read more →</Link>
                        </p>
                      </article>
                      {rule}
                    </Fragment>
                  )
                })
              }
            </Await>
          </Suspense>
        </Prose>
      </main>
    </>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <Prose as="main" className="py-4">
      {error instanceof Error ? (
        <>
          <h1>Error while rendering posts</h1>
          <p>{error.message}</p>
          <pre>
            <code>
              {error.stack?.split('\n').map((line) => (
                <span key={line} data-line>
                  {line}
                </span>
              ))}
            </code>
          </pre>
        </>
      ) : (
        <h1>Unknown error while rendering posts</h1>
      )}
    </Prose>
  )
}
