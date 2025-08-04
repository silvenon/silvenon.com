import { redirect, data } from 'react-router'
import { lazy } from 'react'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { getSeriesMeta, getStandalonePostMeta } from '~/utils/posts.server'
import { formatDateISO } from '~/utils/date'
import { catchall } from '~/.server/catchall'
import type { MDXModule } from 'mdx/types'
import type { Route } from './+types/post-standalone'

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

export async function loader({ request, params }: Route.LoaderArgs) {
  const series = await getSeriesMeta(params.postSlug)
  if (series) {
    throw redirect(`/blog/${series.slug}/${series.parts[0].slug}`, 302)
  }

  const post = await getStandalonePostMeta(params.postSlug)
  if (!post) throw await catchall({ request })

  return data(
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

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  const cacheControl = loaderHeaders.get('Cache-Control')
  const result = new Headers()
  if (cacheControl) result.set('Cache-Control', cacheControl)
  return result
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data) return [] // TODO: handle error?
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

export default function StandalonePost({ loaderData }: Route.ComponentProps) {
  const StandalonePost = standalonePostBySlug[loaderData.slug]
  return <Post {...loaderData} PostContent={StandalonePost} />
}
