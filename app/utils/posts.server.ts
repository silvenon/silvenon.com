import fs from 'node:fs/promises'
import { basename, dirname, join as joinPath } from 'node:path'

const standalonePostFrontmatter = import.meta.glob<StandalonePostFrontmattter>(
  '/posts/*.mdx',
  { import: 'frontmatter' },
)
const seriesPostFrontmatter = import.meta.glob<SeriesPostFrontmatter>(
  '/posts/*/*.mdx',
  { import: 'frontmatter' },
)
const seriesMeta = import.meta.glob<SeriesMeta>('/posts/*/series.json', {
  import: 'default',
})

export interface StandalonePostFrontmattter {
  title: string
  htmlTitle?: string
  description: string
  category?: string
  published?: string
  lastModified?: string
  tweet?: string
}

export interface SeriesPostFrontmatter {
  seriesPart: number
  title: string
  htmlTitle?: string
  description: string
  category?: string
  lastModified?: string
}

export interface SeriesMeta {
  title: string
  htmlTitle?: string
  description: string
  published?: string
  tweet?: string
}

interface ExternalStandalonePost {
  title: string
  description: string
  source: string
  url: string
  published: string
}

interface ExternalSeries {
  title: string
  description: string
  source: string
  parts: Array<{
    title: string
    description: string
    url: string
    published: string
  }>
}

export const externalPosts: Array<ExternalStandalonePost | ExternalSeries> = [
  {
    title: `Setting Up an End-to-End Testing Workflow with Gulp, Mocha, and WebdriverIO`,
    description: `Manual testing is usually slow, tedious and error-prone, we need a way to automate testing across different browsers and platforms.`,
    source: 'Semaphore',
    url: 'https://semaphoreci.com/community/tutorials/setting-up-an-end-to-end-testing-workflow-with-gulp-mocha-and-webdriverio',
    published: '2015-10-21',
  },
  {
    title: `Testing with AVA`,
    description: `Unit testing a simple todo application built with React and Redux using AVA.`,
    source: 'Semaphore',
    parts: [
      {
        title: `Getting Started`,
        description: `Setting up our todo application using Create React App, configuring AVA, and running our first test.`,
        url: 'https://semaphoreci.com/community/tutorials/getting-started-with-create-react-app-and-ava',
        published: '2016-10-25',
      },
      {
        title: `Common Redux Patterns`,
        description: `Testing Redux actions, reducers, and selectors, and configuring the Redux store.`,
        url: 'https://semaphoreci.com/community/tutorials/testing-common-redux-patterns-in-react-using-ava',
        published: '2016-11-30',
      },
      {
        title: `React Components`,
        description: `Building and testing the UI using Enzyme, Test Utilities, Sinon.JS and redux-mock-store.`,
        url: 'https://semaphoreci.com/community/tutorials/testing-react-components-with-ava',
        published: '2017-02-01',
      },
    ],
  },
  {
    title: `Bridging the Gap Between CSS and JavaScript`,
    description: `As developing web applications becomes more commonplace and nuanced, we often look for creative ways to bridge the gaps between those languages to make our development environments and workflows easier and more efficient.`,
    source: 'CSS-Tricks',
    parts: [
      {
        title: `CSS-in-JS`,
        description: `Digging into the concept of CSS-in-JS. If you're already acquainted with this concept, you might still enjoy a stroll through the philosohpy of this approach.`,
        url: 'https://css-tricks.com/bridging-the-gap-between-css-and-javascript-css-in-js/',
        published: '2018-12-03',
      },
      {
        title: `CSS Modules, PostCSS and the Future of CSS`,
        description: `Exploring tools for "plain ol' CSS" by refactoring the Photo component from the example in the CSS-in-JS article, the previous part of this series.`,
        url: 'https://css-tricks.com/bridging-the-gap-between-css-and-javascript-css-modules-postcss-and-the-future-of-css/',
        published: '2018-12-04',
      },
    ],
  },
  {
    title: `Migrating from Gatsby to Next.js`,
    description: `My experience of rewriting my Gatsby blog to Next.js, what went well, and what didn’t.`,
    source: 'LogRocket',
    url: 'https://blog.logrocket.com/migrating-from-gatsby-to-next-js/',
    published: '2020-06-16',
  },
]

export async function getAllPostsMeta() {
  const entries = await Promise.all([
    ...externalPosts,
    ...Object.keys(standalonePostFrontmatter).map(async (path) => {
      const slug = basename(path, '.mdx')
      const meta = await standalonePostFrontmatter[path]()
      const result: StandalonePostFrontmattter & {
        slug: string
        fileModified?: string
      } = { ...meta, slug }
      if (import.meta.env.DEV) {
        result.fileModified = (
          await fs.stat(joinPath(process.cwd(), path))
        ).mtime.toISOString()
      }
      return result
    }),
    ...Object.keys(seriesMeta).map((path) => {
      return getSeriesMeta(basename(dirname(path)))
    }),
  ])

  return entries
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .filter((entry) => {
      // exclude drafts in production
      return import.meta.env.DEV || 'source' in entry || 'published' in entry
    })
    .sort((a, b) => {
      let publishedA =
        'source' in a && 'parts' in a ? a.parts[0].published : a.published
      if (typeof publishedA !== 'string' && 'fileModified' in a) {
        publishedA = a.fileModified
      }

      let publishedB =
        'source' in b && 'parts' in b ? b.parts[0].published : b.published
      if (typeof publishedB !== 'string' && 'fileModified' in b) {
        publishedB = b.fileModified
      }

      if (typeof publishedA !== 'string') return -1
      if (typeof publishedB !== 'string') return 1
      const publishedDateA = new Date(publishedA)
      const publishedDateB = new Date(publishedB)
      if (publishedDateA > publishedDateB) return -1
      if (publishedDateA < publishedDateB) return 1

      return 0
    })
}

export async function getStandalonePostMeta(slug: string) {
  const path = `/posts/${slug}.mdx`
  const isStandalonePost = path in standalonePostFrontmatter
  if (!isStandalonePost) return null
  const frontmatter = await standalonePostFrontmatter[path]()
  const isPublished = 'published' in frontmatter
  if (!isPublished && !import.meta.env.DEV) return null
  return frontmatter
}

export async function getSeriesMeta(slug: string) {
  const seriesPath = `/posts/${slug}/series.json`
  const isSeries = seriesPath in seriesMeta
  if (!isSeries) return null
  const meta = await seriesMeta[seriesPath]()
  const isPublished = 'published' in meta
  if (!isPublished && !import.meta.env.DEV) return null
  const partPaths = Object.keys(seriesPostFrontmatter).filter((postPath) =>
    postPath.startsWith(`/posts/${slug}/`),
  )
  const parts = await Promise.all(
    partPaths.map(async (postPath) => {
      const meta = await seriesPostFrontmatter[postPath]()
      return { slug: basename(postPath, '.mdx'), ...meta }
    }),
  ).then((parts) => {
    return parts.sort((a, b) => a.seriesPart - b.seriesPart)
  })

  const result: SeriesMeta & {
    slug: string
    parts: typeof parts
    fileModified?: string
  } = { ...meta, slug, parts }

  if (import.meta.env.DEV) {
    result.fileModified = new Date(
      Math.max(
        ...(await Promise.all(
          [seriesPath, ...partPaths].map(async (path) => {
            const stats = await fs.stat(joinPath(process.cwd(), path))
            return stats.mtimeMs
          }),
        )),
      ),
    ).toISOString()
  }

  return result
}
