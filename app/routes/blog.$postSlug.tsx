import { useLoaderData } from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import type {
  LoaderFunctionArgs,
  HeadersFunction,
  MetaFunction,
} from '@remix-run/node'
import { lazy } from 'react'
import invariant from 'tiny-invariant'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { getSeriesMeta, getStandalonePostMeta } from '~/utils/posts.server'
import { formatDateISO } from '~/utils/date'
import { loader as catchallLoader } from './$'
import type { MDXModule } from 'mdx/types'

const standalonePostBySlug = Object.fromEntries(
  Object.entries(import.meta.glob<MDXModule>('/posts/*.mdx')).map(
    ([path, load]) => {
      const slug = path
        .split('/')
        .slice(-1)[0]
        .replace(/\.mdx$/, '')
      return [slug, lazy(load)]
    },
  ),
)

export async function loader(args: LoaderFunctionArgs) {
  const { params } = args
  invariant(params.postSlug, 'slug is required')

  const series = await getSeriesMeta(params.postSlug)
  if (series) {
    throw redirect(`/blog/${series.slug}/${series.parts[0].slug}`, 302)
  }

  const post = await getStandalonePostMeta(params.postSlug)
  if (!post) throw await catchallLoader(args)

  return json(
    {
      slug: params.postSlug,
      title: post.title,
      description: post.description,
      htmlTitle: post.htmlTitle,
      published: post.published,
      lastModified: post.lastModified,
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
  const { title, description, published, lastModified } = data
  return [
    ...getMeta({ type: 'article', title, description }),
    { property: 'article:author', content: author.name },
    ...(published
      ? [
          {
            property: 'article:published_time',
            content: formatDateISO(published),
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

export default function StandalonePost() {
  const data = useLoaderData<typeof loader>()
  const StandalonePost = standalonePostBySlug[data.slug]
  return <Post {...data} PostContent={StandalonePost} />
}
