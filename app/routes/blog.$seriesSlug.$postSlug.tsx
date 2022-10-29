import { useLoaderData } from '@remix-run/react'
import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { getSeries } from '~/utils/posts.server'
import { formatDateISO } from '~/utils/date'
import { loader as catchallLoader } from './$'

export async function loader(args: LoaderArgs) {
  const { params } = args
  invariant(params.seriesSlug, 'series parameter is required')
  invariant(params.postSlug, 'slug parameter is required')

  const series = await getSeries(params.seriesSlug)
  if (!series) return catchallLoader(args)
  const part = series.parts.find(({ slug }) => slug === params.postSlug)
  if (!part) return catchallLoader(args)

  try {
    return json({
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
      code: part.output,
    })
  } catch (err) {
    throw new Response('Failed to compile blog post', { status: 500 })
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  // type of data is incorrect, in case of an error it's undefined
  const { title, series, description, lastModified } = data ?? {}
  return {
    ...(title && description
      ? getMeta({
          type: 'article',
          title: `${series?.title}: ${title}`,
          description,
        })
      : getMeta({
          title: 'Post not found',
        })),
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
  const data = useLoaderData<typeof loader>()
  return <Post {...data} />
}
