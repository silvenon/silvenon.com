import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { parseISO, compareDesc } from 'date-fns'
import { formatDateISO } from './date'
import { ROOT_DIR } from '~/consts.server'

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
  const postOrSeriesBasenames = await fs.readdir(`${ROOT_DIR}/app/posts`, {
    withFileTypes: true,
  })

  const posts = await Promise.all(
    postOrSeriesBasenames
      .filter((dirent) => dirent.name !== '__tests__')
      .map(async (dirent) => {
        return dirent.isFile()
          ? await getPost(path.basename(dirent.name, '.mdx'))
          : await getSeries(dirent.name)
      }),
  )

  posts.sort(comparePublished)

  if (process.env.NODE_ENV === 'production') {
    return posts.filter((post) => post.published)
  }

  return posts
}

export async function getPost(slug: string): Promise<StandalonePost> {
  const postPath = `${ROOT_DIR}/app/posts/${slug}.mdx`
  const postContent = await fs.readFile(postPath, 'utf8')
  const post = matter(postContent).data as Omit<
    StandalonePost,
    'pathname' | 'published'
  > & { published: Date }
  return {
    ...post,
    pathname: `/blog/${slug}`,
    published: post.published ? formatDateISO(post.published) : undefined,
  }
}

export async function getSeries(slug: string): Promise<Series> {
  const seriesPath = `${ROOT_DIR}/app/posts/${slug}`
  const seriesPathname = `/blog/${slug}`
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
