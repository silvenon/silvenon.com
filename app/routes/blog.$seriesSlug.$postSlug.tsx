import { useLoaderData } from '@remix-run/react'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
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
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  // type of data is incorrect, in case of an error it's undefined
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
  return <Post {...data} />
}
