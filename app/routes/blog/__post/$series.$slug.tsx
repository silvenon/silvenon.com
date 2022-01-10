import { useLoaderData } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import { bundleMDXPost } from '~/utils/mdx.server'
import { getSeries, SeriesPart } from '~/utils/posts.server'
import invariant from 'tiny-invariant'
import type { LoaderData as StandaloneLoaderData } from './$slug'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'

export interface LoaderData extends StandaloneLoaderData {
  seriesTitle: string
  seriesPart: number
  parts: Array<{
    pathname: string
    title: string
  }>
}

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  invariant(params.series, 'series parameter is required')
  invariant(params.slug, 'slug parameter is required')
  const series = await getSeries(params.series)
  if (process.env.NODE_ENV === 'production' && !series.published) {
    throw new Response('Not Found', { status: 404 })
  }
  const { frontmatter, code } = await bundleMDXPost<SeriesPart>(
    `${__dirname}/../../app/posts/${params.series}/${params.slug}.mdx`,
  )
  return {
    ...frontmatter,
    seriesTitle: series.title,
    parts: series.parts,
    published: series.published,
    code,
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
