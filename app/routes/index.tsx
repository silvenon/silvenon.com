import { useLoaderData, Link } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Fragment } from 'react'
import clsx from 'clsx'
import PostDate from '~/components/PostDate'
import ProfilePhoto from '~/components/ProfilePhoto'
import Icon from '~/components/Icon'
import Prose from '~/components/Prose'
import { getMeta } from '~/utils/seo'
import {
  getAllEntries,
  StandalonePost,
  Series,
  SeriesPart,
} from '~/utils/posts.server'
import { SITE_DESCRIPTION, author, socialLinks } from '~/consts'
import circuitBoard from '~/images/circuit-board.svg'

type LoaderData = Array<
  | Omit<StandalonePost, 'content'>
  | (Omit<Series, 'parts'> & { parts: Array<Omit<SeriesPart, 'content'>> })
>

export const loader: LoaderFunction = async () => {
  const entries = await getAllEntries()
  // TODO: type doesn't restrict adding `content`
  const data: LoaderData = entries.map((entry) =>
    'parts' in entry
      ? {
          ...entry,
          parts: entry.parts.map((part) => ({
            ...part,
            content: undefined,
          })),
        }
      : {
          ...entry,
          content: undefined,
        },
  )
  return json(data, 200)
}

export const meta: MetaFunction = () =>
  getMeta({
    title: author.name,
    description: SITE_DESCRIPTION,
  })

export default function Home() {
  const entries = useLoaderData<LoaderData>()
  return (
    <>
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
                        'mx-1 block rounded-t-md bg-white bg-opacity-50 p-2 text-black  transition-colors duration-200 hover:bg-white hover:bg-opacity-100 sm:mx-1.5',
                        'dark:bg-gray-800 dark:bg-opacity-50 dark:text-white dark:hover:bg-gray-800 dark:hover:bg-opacity-100',
                      )}
                    >
                      <span className="sr-only">{network.name}</span>
                      <Icon
                        aria-hidden="true"
                        icon={network.icon}
                        className="h-5 w-5 fill-current"
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
        <Prose>
          <h2>Posts</h2>
          {entries.map((entry, index) => {
            if ('parts' in entry) {
              const series = entry
              return (
                <Fragment key={series.slug}>
                  <article>
                    <h3>
                      <Link
                        to={`/blog/${series.slug}/${series.parts[0].slug}?root`}
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
                  {index < entries.length - 1 ? <hr /> : null}
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
                {index < entries.length - 1 ? <hr /> : null}
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
  )
}
