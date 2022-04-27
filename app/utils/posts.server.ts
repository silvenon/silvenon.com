import matter from 'gray-matter'
import fs from 'fs/promises'
import path from 'path'
import { parseISO, compareDesc } from 'date-fns'
import { ROOT_DIR } from '../consts.server'

export interface StandalonePost {
  slug: string
  title: string
  htmlTitle?: string
  description: string
  category?: string
  published?: Date
  lastModified?: Date
  tweet?: string
  output: string
}

export interface Series {
  slug: string
  title: string
  htmlTitle?: string
  description: string
  published?: Date
  tweet: string
  parts: SeriesPart[]
}

export interface SeriesPart extends Omit<StandalonePost, 'published'> {
  seriesPart: number
}

export interface ExternalStandalonePost {
  title: string
  description: string
  source: string
  url: string
  published: Date
}

export interface ExternalSeries {
  title: string
  description: string
  source: string
  parts: Array<{
    title: string
    description: string
    url: string
    published: Date
  }>
}

export const externalPosts: Array<ExternalStandalonePost | ExternalSeries> = [
  {
    title: `Setting Up an End-to-End Testing Workflow with Gulp, Mocha, and WebdriverIO`,
    description: `Manual testing is usually slow, tedious and error-prone, we need a way to automate testing across different browsers and platforms.`,
    source: 'Semaphore',
    url: 'https://semaphoreci.com/community/tutorials/setting-up-an-end-to-end-testing-workflow-with-gulp-mocha-and-webdriverio',
    published: parseISO('2015-10-21'),
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
        published: parseISO('2016-10-25'),
      },
      {
        title: `Common Redux Patterns`,
        description: `Testing Redux actions, reducers, and selectors, and configuring the Redux store.`,
        url: 'https://semaphoreci.com/community/tutorials/testing-common-redux-patterns-in-react-using-ava',
        published: parseISO('2016-11-30'),
      },
      {
        title: `React Components`,
        description: `Building and testing the UI using Enzyme, Test Utilities, Sinon.JS and redux-mock-store.`,
        url: 'https://semaphoreci.com/community/tutorials/testing-react-components-with-ava',
        published: parseISO('2017-02-01'),
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
        published: parseISO('2018-12-03'),
      },
      {
        title: `CSS Modules, PostCSS and the Future of CSS`,
        description: `Exploring tools for "plain ol' CSS" by refactoring the Photo component from the example in the CSS-in-JS article, the previous part of this series.`,
        url: 'https://css-tricks.com/bridging-the-gap-between-css-and-javascript-css-modules-postcss-and-the-future-of-css/',
        published: parseISO('2018-12-04'),
      },
    ],
  },
  {
    title: `Migrating from Gatsby to Next.js`,
    description: `My experience of rewriting my Gatsby blog to Next.js, what went well, and what didn’t.`,
    source: 'LogRocket',
    url: 'https://blog.logrocket.com/migrating-from-gatsby-to-next-js/',
    published: parseISO('2020-06-16'),
  },
]

export async function getAllEntries() {
  const entries: Array<
    StandalonePost | Series | ExternalStandalonePost | ExternalSeries
  > = [...externalPosts]

  const dirents = await fs.readdir(`${ROOT_DIR}/../posts`, {
    withFileTypes: true,
  })

  for (const dirent of dirents) {
    if (dirent.name === '__tests__') continue
    if (dirent.isFile()) {
      if (!dirent.name.endsWith('.mdx')) continue
      const postSlug = path.basename(dirent.name, '.mdx')
      const post = await getStandalonePost(postSlug)
      if (post !== null) entries.push(post)
      else throw new Error(`Could not find post "${postSlug}"`)
    } else {
      const seriesSlug = dirent.name
      const series = await getSeries(seriesSlug)
      if (series !== null) entries.push(series)
      else throw new Error(`Could not find series "${seriesSlug}"`)
    }
  }

  entries.sort((a, b) => {
    const publishedA =
      'source' in a && 'parts' in a ? a.parts[0].published : a.published
    const publishedB =
      'source' in b && 'parts' in b ? b.parts[0].published : b.published
    if (!publishedA) return -1
    if (!publishedB) return 1
    return compareDesc(publishedA, publishedB)
  })

  if (process.env.NODE_ENV === 'development') {
    return entries
  }

  return entries.filter((entry) => 'source' in entry || entry.published)
}

export async function getStandalonePost(
  slug: string,
): Promise<StandalonePost | null> {
  let source, output
  try {
    source = await fs.readFile(`${ROOT_DIR}/../posts/${slug}.mdx`, 'utf8')
    output = await fs.readFile(`${ROOT_DIR}/posts/${slug}.js`, 'utf8')
  } catch {
    return null
  }
  const file = matter(source)
  const frontmatter = file.data as Omit<StandalonePost, 'slug' | 'output'>
  if (!frontmatter.published && process.env.NODE_ENV === 'production') {
    return null
  }
  return { ...frontmatter, slug, output }
}

export async function getSeries(seriesSlug: string): Promise<Series | null> {
  let series
  try {
    series = JSON.parse(
      await fs.readFile(`${ROOT_DIR}/posts/${seriesSlug}/series.json`, 'utf8'),
    ) as Omit<Series, 'slug' | 'published' | 'parts'> & { published?: string }
  } catch {
    return null
  }

  if (!series.published && process.env.NODE_ENV === 'production') {
    return null
  }

  const parts: SeriesPart[] = []

  const partDirents = await fs.readdir(`${ROOT_DIR}/../posts/${seriesSlug}`, {
    withFileTypes: true,
  })

  for (const partDirent of partDirents) {
    if (!partDirent.name.endsWith('.mdx')) continue
    const slug = path.basename(partDirent.name, '.mdx')
    const source = await fs.readFile(
      `${ROOT_DIR}/../posts/${seriesSlug}/${slug}.mdx`,
      'utf8',
    )
    const output = await fs.readFile(
      `${ROOT_DIR}/posts/${seriesSlug}/${slug}.js`,
      'utf8',
    )
    const file = matter(source)
    const frontmatter = file.data as Omit<SeriesPart, 'slug' | 'output'>
    parts.push({
      ...frontmatter,
      slug: path.basename(partDirent.name, '.mdx'),
      output,
    })
  }

  parts.sort((a, b) => a.seriesPart - b.seriesPart)

  return {
    ...series,
    published: series.published ? parseISO(series.published) : undefined,
    slug: seriesSlug,
    parts,
  }
}
