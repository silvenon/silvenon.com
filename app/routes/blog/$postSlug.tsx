import { useLoaderData } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import invariant from 'tiny-invariant'
import { bundleMDXPost } from '~/utils/mdx.server'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { getStandalonePost } from '~/utils/posts.server'
import { formatDateISO } from '~/utils/date'

export interface LoaderData {
  htmlTitle?: string
  title: string
  description: string
  published?: Date
  lastModified?: Date
  code: string
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.postSlug, 'slug is required')
  const post = await getStandalonePost(params.postSlug)
  if (!post) throw new Response('Not Found', { status: 404 })
  try {
    const code = await bundleMDXPost(post.content)
    const data: LoaderData = {
      title: post.title,
      description: post.description,
      htmlTitle: post.htmlTitle,
      published: post.published,
      lastModified: post.lastModified,
      code,
    }
    return data
  } catch (err) {
    throw new Response('Failed to compile blog post', { status: 500 })
  }
}

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => {
  const { title, description, published, lastModified } = data ?? {}
  return {
    ...(title && description
      ? getMeta({ title, description })
      : { title: 'Post Error' }),
    'og:type': 'article',
    'article:author': author.name,
    ...(published
      ? { 'article:published_time': formatDateISO(published) }
      : null),
    ...(lastModified
      ? { 'article:modified_time': formatDateISO(lastModified) }
      : null),
  }
}

export default function StandalonePost() {
  const data = useLoaderData<LoaderData>()
  return <Post {...data} />
}
