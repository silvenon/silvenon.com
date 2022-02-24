import { useLoaderData } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import { bundleMDXPost } from '~/utils/mdx.server'
import type { SeriesPart } from '~/utils/posts.server'
import invariant from 'tiny-invariant'
import type { LoaderData as StandaloneLoaderData } from './$slug'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { db } from '~/utils/db.server'
import { formatDateISO } from '~/utils/date'

export interface LoaderData extends StandaloneLoaderData {
  seriesTitle: string
  seriesPart: number
  parts: Array<{
    pathname: string
    title: string
  }>
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.series, 'series parameter is required')
  invariant(params.slug, 'slug parameter is required')

  const part = await db.seriesPart.findUnique({
    where: {
      slug_seriesSlug: {
        slug: params.slug,
        seriesSlug: params.series,
      },
    },
    select: {
      title: true,
      htmlTitle: true,
      description: true,
      lastModified: true,
      content: true,
      seriesPart: true,
      series: {
        select: {
          title: true,
          published: true,
          parts: {
            select: {
              slug: true,
              title: true,
            },
            orderBy: {
              seriesPart: 'asc',
            },
          },
        },
      },
    },
  })

  if (
    !part ||
    (process.env.NODE_ENV === 'production' && !part.series.published)
  ) {
    throw new Response('Not Found', { status: 404 })
  }

  try {
    const code = await bundleMDXPost(part.content)
    const data: LoaderData = {
      title: part.title,
      htmlTitle: part.htmlTitle ?? undefined,
      description: part.description,
      seriesTitle: part.series.title,
      seriesPart: part.seriesPart,
      parts: part.series.parts.map((part) => ({
        ...part,
        pathname: `/blog/${params.series}/${part.slug}`,
      })),
      published:
        part.series.published !== null
          ? formatDateISO(part.series.published)
          : undefined,
      lastModified:
        part.lastModified !== null
          ? formatDateISO(part.lastModified)
          : undefined,
      code,
    }
    return data
  } catch (err) {
    throw new Response('Failed to compile blog post', { status: 500 })
  }
}

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => {
  const { title, seriesTitle, description, published, lastModified } =
    data ?? {}
  return {
    ...(title && description
      ? getMeta({ title: `${seriesTitle}: ${title}`, description })
      : { title: 'Post Error' }),
    'og:type': 'article',
    'article:author': author.name,
    ...(published ? { 'article:published_time': published } : null),
    ...(lastModified ? { 'article:modified_time': lastModified } : null),
  }
}

export default function SeriesPart() {
  const data = useLoaderData<LoaderData>()
  return <Post {...data} />
}
