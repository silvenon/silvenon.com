import { compareDesc } from 'date-fns'
import { formatDateISO } from './date'
import { db } from './db.server'
import type { StandalonePost, Series, SeriesPart, Prisma } from '@prisma/client'

interface StandalonePostWithAdditionalFields
  extends Omit<StandalonePost, 'published'> {
  pathname: string
  published?: string
}
interface SeriesWithAdditionalFields extends Omit<Series, 'published'> {
  pathname: string
  published?: string
  parts: SeriesPartWithAdditionalFields[]
}
interface SeriesPartWithAdditionalFields extends SeriesPart {
  pathname: string
}

export type {
  StandalonePostWithAdditionalFields as StandalonePost,
  SeriesWithAdditionalFields as Series,
  SeriesPartWithAdditionalFields as SeriesPart,
}

export async function getAllPosts(): Promise<
  Array<StandalonePostWithAdditionalFields | SeriesWithAdditionalFields>
> {
  const filters: Prisma.StandalonePostWhereInput = {
    // filter out drafts in production
    ...(process.env.NODE_ENV === 'production'
      ? { published: { not: null } }
      : null),
  }

  const standalonePosts = (
    await db.standalonePost.findMany({
      where: { ...filters },
    })
  ).map((post) => ({
    ...post,
    pathname: `/blog/${post.slug}`,
  }))

  const series = (
    await db.series.findMany({
      where: { ...filters },
      include: {
        parts: {
          orderBy: {
            seriesPart: 'asc',
          },
        },
      },
    })
  ).map((series) => ({
    ...series,
    pathname: `/blog/${series.slug}`,
    parts: series.parts.map((part) => ({
      ...part,
      pathname: `/blog/${series.slug}/${part.slug}`,
    })),
  }))

  return [...standalonePosts, ...series]
    .sort((postA, postB) => {
      if (!postA.published) return -1
      if (!postB.published) return 1
      return compareDesc(postA.published, postB.published)
    })
    .map((post) => ({
      ...post,
      published: post.published ? formatDateISO(post.published) : undefined,
    }))
}
