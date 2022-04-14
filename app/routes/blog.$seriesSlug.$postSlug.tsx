import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { bundleMDXPost } from '~/utils/mdx.server'
import invariant from 'tiny-invariant'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { getSeries } from '~/utils/posts.server'
import { formatDateISO } from '~/utils/date'

export interface LoaderData
  extends Omit<import('./blog.$postSlug').LoaderData, 'slug' | 'published'> {
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
  invariant(params.seriesSlug, 'series parameter is required')
  invariant(params.postSlug, 'slug parameter is required')

  const series = await getSeries(params.seriesSlug)
  if (!series) throw new Response('Not Found', { status: 404 })
  const part = series.parts.find(({ slug }) => slug === params.postSlug)
  if (!part) throw new Response('Not Found', { status: 404 })

  try {
    const code = await bundleMDXPost(part.content)
    const data: LoaderData = {
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

export { CatchBoundary } from './blog.$postSlug'
