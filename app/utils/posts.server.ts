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

export async function getAllEntries() {
  const entries: Array<StandalonePost | Series> = []
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
    if (!a.published) return -1
    if (!b.published) return 1
    return compareDesc(a.published, b.published)
  })

  if (process.env.NODE_ENV === 'development') {
    return entries
  }

  return entries.filter((entry) => entry.published)
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
      await fs.readFile(
        `${ROOT_DIR}/../posts/${seriesSlug}/series.json`,
        'utf8',
      ),
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
