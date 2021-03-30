import { compareDesc, parseISO } from 'date-fns'
import { formatDateISO } from './date'

const standalonePostModules = import.meta.globEager('/src/posts/*/meta.yml')
const seriesPartModules = import.meta.globEager('/src/posts/*/*/meta.yml')
const seriesModules = import.meta.globEager('/src/posts/*/series.yml')

export interface StandalonePostMeta {
  title: string
  description: string
  published?: string
  lastModified?: string
  tweet?: string
}
export interface SeriesPartMeta extends StandalonePostMeta {
  seriesTitle: string
  seriesPart: number
}

const standalonePostsMeta: Array<{
  importPath: string
  meta: StandalonePostMeta
}> = Object.entries(standalonePostModules).map(([importPath, data]) => ({
  importPath: importPath.replace('meta.yml', 'post.mdx'),
  meta: data.default,
}))
const seriesPartsMeta: Array<{
  importPath: string
  meta: SeriesPartMeta
}> = Object.entries(seriesPartModules).map(([importPath, data]) => ({
  importPath: importPath.replace('meta.yml', 'post.mdx'),
  meta: data.default,
}))

export interface StandalonePost extends StandalonePostMeta {
  importPath: string
  pathname: string
}
export interface SeriesPart extends SeriesPartMeta, StandalonePost {
  parts: SeriesPart[]
}
export type Post = StandalonePost | SeriesPart

export interface Series {
  importPath: string
  title: string
  description: string
  published?: string
  tweet: string
  parts: SeriesPart[]
}

export const series: Series[] = Object.entries(seriesModules).map(
  ([seriesImportPath, data]) => {
    const parts = seriesPartsMeta
      .filter((post) =>
        seriesImportPath.includes(post.importPath.split('/')[3]),
      )
      .map(({ importPath, meta }) => ({
        importPath,
        pathname: getPostPathname(importPath),
        ...meta,
        published: formatDateISO(data.default.published),
        seriesTitle: data.default.title,
      }))
      .sort((postA, postB) => {
        if (postA.seriesPart < postB.seriesPart) {
          return -1
        }
        if (postA.seriesPart > postB.seriesPart) {
          return 1
        }
        return 0
      })
    return {
      importPath: seriesImportPath,
      ...data.default,
      published: formatDateISO(data.default.published),
      parts: parts.map((part) => ({ ...part, parts })),
    }
  },
)

export const standalonePosts: StandalonePost[] = standalonePostsMeta.map(
  ({ importPath, meta }) => ({
    importPath,
    pathname: getPostPathname(importPath),
    ...meta,
    published: meta.published && formatDateISO(meta.published),
  }),
)

export const posts: Post[] = [
  ...standalonePosts,
  ...series
    .map((s) =>
      s.parts.map((part) => ({
        ...part,
        title: `${part.seriesTitle}: ${part.title}`,
      })),
    )
    .flat(),
].sort(comparePublished)

function getPostPathname(importPath: string): string {
  return importPath.replace('/src/posts', '/blog').replace('post.mdx', '')
}

interface PostOrSeries {
  published?: string
}

export function comparePublished(a: PostOrSeries, b: PostOrSeries) {
  if (!a.published) return -1
  if (!b.published) return 1
  return compareDesc(parseISO(a.published), parseISO(b.published))
}
