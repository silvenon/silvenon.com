import { useLoaderData } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import { bundleMDXPost } from '~/utils/mdx.server'
import invariant from 'tiny-invariant'
import type { LoaderData as StandaloneLoaderData } from './$slug'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { db } from '~/utils/db.server'
import { formatDateISO } from '~/utils/date'

export interface LoaderData extends Omit<StandaloneLoaderData, 'published'> {
  seriesPart: number
  series: {
    slug: string
    title: string
    published?: Date
    parts: Array<{
      slug: string
      title: string
    }>
  }
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
      seriesPart: part.seriesPart,
      series: {
        slug: params.series,
        title: part.series.title,
        published: part.series.published ?? undefined,
        parts: part.series.parts,
      },
      lastModified: part.lastModified ?? undefined,
      code,
    }
    return data
  } catch (err) {
    throw new Response('Failed to compile blog post', { status: 500 })
  }
}

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => {
  const { title, series, description, lastModified } = data ?? {}
  return {
    ...(title && description
      ? getMeta({ title: `${series?.title}: ${title}`, description })
      : { title: 'Post Error' }),
    'og:type': 'article',
    'article:author': author.name,
    ...(series?.published
      ? { 'article:published_time': formatDateISO(series.published) }
      : null),
    ...(lastModified
      ? { 'article:modified_time': formatDateISO(lastModified) }
      : null),
  }
}

export default function SeriesPart() {
  const data = useLoaderData<LoaderData>()
  return <Post {...data} />
}
