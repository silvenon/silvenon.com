import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { parseISO, compareDesc } from 'date-fns'
import { formatDateISO } from './date'

export interface StandalonePost {
  title: string
  htmlTitle?: string
  description: string
  published?: string
  pathname: string
  tweet?: string
  lastModified?: string
}
export interface Series extends Omit<StandalonePost, 'lastModified'> {
  parts: SeriesPart[]
}
export interface SeriesPart extends Omit<StandalonePost, 'published'> {
  seriesPart: number
}

export async function getAllPosts(): Promise<Array<StandalonePost | Series>> {
  const postOrSeriesBasenames = await fs.readdir(`${process.cwd()}/app/posts`, {
    withFileTypes: true,
  })

  const posts = await Promise.all(
    postOrSeriesBasenames
      .filter((dirent) => dirent.name !== '__tests__')
      .map(async (dirent) => {
        return dirent.isFile()
          ? await getPost(dirent.name)
          : await getSeries(dirent.name)
      }),
  )

  posts.sort(comparePublished)

  if (process.env.NODE_ENV === 'production') {
    return posts.filter((post) => post.published)
  }

  return posts
}

export async function getPost(file: string): Promise<StandalonePost> {
  const postPath = `${process.cwd()}/app/posts/${file}`
  try {
    await fs.open(postPath, 'r')
  } catch (err) {
    throw new Response('Not Found', { status: 404 })
  }
  const postContent = await fs.readFile(postPath, 'utf8')
  const post = matter(postContent).data as Omit<
    StandalonePost,
    'pathname' | 'published'
  > & { published: Date }
  return {
    ...post,
    pathname: `/blog/${path.basename(file, '.mdx')}`,
    published: post.published ? formatDateISO(post.published) : undefined,
  }
}

export async function getSeries(dir: string): Promise<Series> {
  const seriesPath = `${process.cwd()}/app/posts/${dir}`
  try {
    await fs.opendir(seriesPath)
  } catch (err) {
    throw new Response('Not Found', { status: 404 })
  }
  const seriesPathname = `/blog/${dir}`
  const series = JSON.parse(
    await fs.readFile(`${seriesPath}/series.json`, 'utf8'),
  ) as Omit<Series, 'pathname' | 'parts'>
  const partDirents = await fs.readdir(seriesPath, {
    withFileTypes: true,
  })
  const seriesParts = await Promise.all(
    partDirents
      .filter((dirent) => dirent.name.endsWith('.mdx'))
      .map(async (dirent) => {
        const partPath = `${seriesPath}/${dirent.name}`
        const postContent = await fs.readFile(partPath, 'utf8')
        const seriesPart = matter(postContent).data as Omit<
          SeriesPart,
          'pathname'
        >
        return {
          ...seriesPart,
          pathname: path.join(
            seriesPathname,
            path.basename(dirent.name, '.mdx'),
          ),
        } as SeriesPart
      }),
  )
  return {
    ...series,
    pathname: seriesPathname,
    parts: seriesParts.sort((a, b) => a.seriesPart - b.seriesPart),
  } as Series
}

function comparePublished<Post extends { published?: string }>(
  a: Post,
  b: Post,
) {
  if (!a.published) return -1
  if (!b.published) return 1
  return compareDesc(
    typeof a.published === 'string' ? parseISO(a.published) : a.published,
    typeof b.published === 'string' ? parseISO(b.published) : b.published,
  )
}
