import React from 'react'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import Layout from '../components/Layout'
import Search from '../components/Search'
import PostDate from '../components/PostDate'
import SeriesParts from '../components/SeriesParts'
import ProfilePhoto from '../components/ProfilePhoto'
import { proseClassName } from '../consts'
import type { RouteComponentProps } from '@reach/router'
import { socialLinks } from '../social'
import {
  standalonePosts,
  series,
  StandalonePost as StandalonePostProps,
  Series as SeriesProps,
  comparePublished,
} from '../posts'
import circuitBoard from '../circuit-board.svg'
import { author } from '../consts'

interface Props extends RouteComponentProps {}

export default function Home({ uri }: Props) {
  const [searchOpen, setSearchOpen] = React.useState(false)

  const title = author.name
  const description =
    'I love learning about JavaScript tools, exploring static site generation, and creating delightful developer experiences.'

  return (
    <Layout uri={uri} title={title} description={description}>
      <section className="relative mt-4 mb-10 bg-purple-200 dark:bg-desatPurple-900 border-t-2 border-b-2 border-purple-300 dark:border-desatPurple-500 px-4">
        <div
          className="absolute inset-0 dark:opacity-20"
          style={{ backgroundImage: `url(${circuitBoard})` }}
        />
        <div className="relative -my-3.5 max-w-sm mx-auto text-center sm:max-w-xl sm:text-left lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
          <div className="bg-white dark:bg-gray-800 p-3 ring-2 ring-purple-300 dark:ring-desatPurple-500 rounded-lg sm:flex">
            <div
              className={clsx(
                proseClassName,
                'p-3 pb-4 sm:order-2 sm:flex-1 sm:self-center lg:px-5 lg:py-3',
              )}
            >
              <h1 className="!mb-0">{title}</h1>
              <p>{description}</p>
            </div>
            <div className="sm:order-1 sm:w-40">
              <div className="relative ar ar-4/2 sm:ar-4/5">
                <ProfilePhoto className="ar-media" />
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
      <main className="mt-6 px-4 sm:flex sm:justify-center">
        <div>
          <Search
            onOpen={() => setSearchOpen(true)}
            onClose={() => setSearchOpen(false)}
          />
          <div className={proseClassName}>
            <h2
              className={clsx(
                'transition-opacity duration-200',
                searchOpen && 'opacity-0',
              )}
            >
              Posts
            </h2>
            {[
              ...standalonePosts.map((post) => ({
                id: post.importPath,
                published: post.published,
                node: <StandalonePost {...post} />,
              })),
              ...series.map((series) => ({
                id: series.importPath,
                published: series.published,
                node: <Series {...series} />,
              })),
            ]
              .sort(comparePublished)
              .map(({ id, node }, index) => {
                const isLast =
                  index >= standalonePosts.length + series.length - 1
                return (
                  <React.Fragment key={id}>
                    {node}
                    {!isLast && <hr />}
                  </React.Fragment>
                )
              })}
          </div>
        </div>
      </main>
    </Layout>
  )
}

function StandalonePost({
  pathname,
  title,
  published,
  description,
}: StandalonePostProps) {
  return (
    <article>
      <h3>
        <a href={pathname}>{title}</a>
      </h3>
      <PostDate published={published} />
      <p>{description}</p>
      <p>
        <a href={pathname}>Read more →</a>
      </p>
    </article>
  )
}

function Series({ parts, title, published, description }: SeriesProps) {
  const pathname = parts[0] && parts[0].pathname
  return (
    <article>
      <h3>
        <a href={pathname}>{title}</a>
      </h3>
      <PostDate published={published} />
      <p>{description}</p>
      <SeriesParts parts={parts} />
    </article>
  )
}
