import { data } from 'react-router'
import { lazy } from 'react'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { getSeriesMeta } from '~/utils/posts.server'
import { formatDateISO } from '~/utils/date'
import { catchall } from './catchall'
import type { MDXModule } from 'mdx/types'
import type { Route } from './+types/post-series'

const seriesPostBySlug = Object.fromEntries(
  Object.entries(import.meta.glob<MDXModule>('/posts/*/*.mdx')).map(
    ([path, load]) => {
      const slug = path.split('/').slice(-1)[0].replace('.mdx', '')
      return [slug, lazy(load)]
    },
  ),
)

export async function loader({ request, params }: Route.LoaderArgs) {
  const series = await getSeriesMeta(params.seriesSlug)
  if (!series) throw await catchall({ request })
  const part = series.parts.find(({ slug }) => slug === params.postSlug)
  if (!part) throw await catchall({ request })

  return data(
    {
      slug: part.slug,
      title: part.title,
      htmlTitle: part.htmlTitle,
      description: part.description,
      seriesPart: part.seriesPart,
      series: {
        slug: params.seriesSlug,
        title: series.title,
        published: series.published,
        parts: series.parts,
      },
      lastModified: part.lastModified,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  const cacheControl = loaderHeaders.get('Cache-Control')
  const result = new Headers()
  if (cacheControl) result.set('Cache-Control', cacheControl)
  return result
}

export function meta({ data }: Route.MetaArgs) {
  const { title, series, description, lastModified } = data
  return [
    ...getMeta({
      type: 'article',
      title: `${series.title}: ${title}`,
      description,
    }),
    { property: 'article:author', content: author.name },
    ...(series.published
      ? [
          {
            property: 'article:published_time',
            content: formatDateISO(series.published),
          },
        ]
      : []),
    ...(lastModified
      ? [
          {
            property: 'article:modified_time',
            content: formatDateISO(lastModified),
          },
        ]
      : []),
  ]
}

export default function SeriesPart({ loaderData }: Route.ComponentProps) {
  const SeriesPost = seriesPostBySlug[loaderData.slug]
  return <Post {...loaderData} PostContent={SeriesPost} />
}
