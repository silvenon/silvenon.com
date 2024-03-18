import { useLoaderData } from '@remix-run/react'
import type {
  LoaderFunctionArgs,
  HeadersFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { lazy } from 'react'
import invariant from 'tiny-invariant'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { getSeriesMeta } from '~/utils/posts.server'
import { formatDateISO } from '~/utils/date'
import { loader as catchallLoader } from './$'
import type { MDXModule } from 'mdx/types'

const seriesPostBySlug = Object.fromEntries(
  Object.entries(import.meta.glob<MDXModule>('/posts/*/*.mdx')).map(
    ([path, load]) => {
      const slug = path.split('/').slice(-1)[0].replace('.mdx', '')
      return [slug, lazy(load)]
    },
  ),
)

export async function loader(args: LoaderFunctionArgs) {
  const { params } = args
  invariant(params.seriesSlug, 'series parameter is required')
  invariant(params.postSlug, 'slug parameter is required')

  const series = await getSeriesMeta(params.seriesSlug)
  if (!series) throw await catchallLoader(args)
  const part = series.parts.find(({ slug }) => slug === params.postSlug)
  if (!part) throw await catchallLoader(args)

  return json(
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

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const cacheControl = loaderHeaders.get('Cache-Control')
  const result = new Headers()
  if (cacheControl) result.set('Cache-Control', cacheControl)
  return result
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return getMeta({ type: 'website', title: 'Post not found' })
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

export default function SeriesPart() {
  const data = useLoaderData<typeof loader>()
  const SeriesPost = seriesPostBySlug[data.slug]
  return <Post {...data} PostContent={SeriesPost} />
}
