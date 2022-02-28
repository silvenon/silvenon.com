import { useLoaderData } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import invariant from 'tiny-invariant'
import { bundleMDXPost } from '~/utils/mdx.server'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { db } from '~/utils/db.server'
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
  invariant(params.slug, 'slug is required')
  const post = await db.standalonePost.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      htmlTitle: true,
      description: true,
      published: true,
      lastModified: true,
      content: true,
    },
  })
  if (!post || (process.env.NODE_ENV === 'production' && !post.published)) {
    throw new Response('Not Found', { status: 404 })
  }
  try {
    const code = await bundleMDXPost(post.content)
    const data: LoaderData = {
      ...post,
      title: post.title,
      description: post.description,
      htmlTitle: post.htmlTitle ?? undefined,
      published: post.published ?? undefined,
      lastModified: post.lastModified ?? undefined,
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
