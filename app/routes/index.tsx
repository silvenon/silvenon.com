import { useLoaderData, Link } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import Header from '~/components/Header'
import { Fragment } from 'react'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import type { Except, SetOptional } from 'type-fest'
import PostDate from '~/components/PostDate'
import ProfilePhoto from '~/components/ProfilePhoto'
import Prose from '~/components/Prose'
import { getMeta } from '~/utils/seo'
import { getAllEntries } from '~/utils/posts.server'
import type {
  StandalonePost,
  Series,
  SeriesPart,
  ExternalStandalonePost,
  ExternalSeries,
} from '~/utils/posts.server'
import { author } from '~/consts'
import circuitBoard from '~/images/circuit-board.svg'

type LoaderData = Array<
  | Except<StandalonePost, 'output'>
  | (Omit<Series, 'parts'> & {
      parts: Array<Except<SeriesPart, 'output'>>
    })
  | ExternalStandalonePost
  | ExternalSeries
>

export const loader: LoaderFunction = async () => {
  const entries = await getAllEntries()
  const data: LoaderData = entries.map((entry) => {
    if ('source' in entry) return entry
    if ('parts' in entry) {
      return {
        ...entry,
        parts: entry.parts.map((part) => {
          const partWithoutOutput: SetOptional<SeriesPart, 'output'> = {
            ...part,
          }
          delete partWithoutOutput.output
          return partWithoutOutput
        }),
      }
    }
    const postWithoutOutput: SetOptional<StandalonePost, 'output'> = {
      ...entry,
    }
    delete postWithoutOutput.output
    return postWithoutOutput
  })

  return json(data, 200)
}

export const meta: MetaFunction = () =>
  getMeta({
    title: author.name,
    description: `Matija Marohnić is a frontend developer from Croatia, he enjoys exploring latest tech. Read this blog to learn about React, frontend tools, testing, and more!`,
  })

export default function Home() {
  const entries = useLoaderData<LoaderData>()
  return (
    <>
      <Header />
      <section className="relative mt-4 mb-10 border-t-2 border-b-2 border-purple-400 bg-purple-300 px-4 dark:border-purple-400 dark:bg-purple-800">
        <div
          className="absolute inset-0 opacity-70 dark:opacity-30"
          style={{ backgroundImage: `url(${circuitBoard})` }}
        />
        <div className="relative -my-3.5 mx-auto max-w-sm text-center sm:max-w-xl sm:text-left lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
          <div className="rounded-lg bg-white p-3 ring-2 ring-purple-400 dark:bg-gray-800 sm:flex">
            <Prose className="p-3 pb-4 sm:order-2 sm:flex-1 sm:self-center lg:px-5 lg:py-3">
              <h1 className="!mb-0">{author.name}</h1>
              <p>
                {author.bio} <Link to="about">More about me →</Link>
              </p>
            </Prose>
            <div className="sm:order-1 sm:w-40">
              <ProfilePhoto />
            </div>
          </div>
        </div>
      </section>
      <main className="mt-6 sm:flex sm:justify-center md:pb-4">
        <Prose>
          <h2>Posts</h2>
          {entries.map((entry, index) => {
            const rule = index < entries.length - 1 ? <hr /> : null

            if ('source' in entry) {
              if ('parts' in entry) {
                const externalSeries = entry
                return (
                  <Fragment key={externalSeries.title}>
                    <article>
                      <h3>{externalSeries.title}</h3>
                      <PostDate published={externalSeries.parts[0].published} />
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
                              <ExternalLinkIcon
                                aria-hidden="true"
                                className="h-6 w-6"
                              />
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
                        <ExternalLinkIcon
                          aria-hidden="true"
                          className="h-6 w-6"
                        />
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
                      <Link to={`/blog/${series.slug}/${series.parts[0].slug}`}>
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
          })}
        </Prose>
      </main>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <Header />
      <Prose as="main" className="py-4">
        <h1>Error while rendering posts</h1>
        <p>{error.message}</p>
        <pre>
          <code>
            {error.stack?.split('\n').map((line) => (
              <span key={line} className="line">
                {line}
              </span>
            ))}
          </code>
        </pre>
      </Prose>
    </>
  )
}
