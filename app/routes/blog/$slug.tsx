import { useLoaderData } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import invariant from 'tiny-invariant'
import Post from '~/components/Post'
import type { StandalonePost } from '~/utils/posts.server'
import { bundleMDXPost } from '~/utils/mdx.server'
import { useMDXPost } from '~/utils/mdx'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'

export interface LoaderData {
  htmlTitle?: string
  title: string
  description: string
  published?: string
  lastModified?: string
  code: string
}

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  invariant(params.slug, 'slug is required')
  const { frontmatter, code } = await bundleMDXPost<StandalonePost>(
    `${process.cwd()}/app/posts/${params.slug}.mdx`,
  )
  if (process.env.NODE_ENV === 'production' && !frontmatter.published) {
    throw new Response('Not Found', { status: 404 })
  }
  return { ...frontmatter, code }
}

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => {
  const { title, description, published, lastModified } = data ?? {}
  return {
    ...(title && description
      ? getMeta({ title, description })
      : { title: 'Post Error' }),
    'og:type': 'article',
    'article:author': author.name,
    ...(published ? { 'article:published_time': published } : null),
    ...(lastModified ? { 'article:modified_time': lastModified } : null),
  }
}

export default function StandalonePost() {
  const { code, ...meta } = useLoaderData<LoaderData>()
  const post = useMDXPost(code)
  return <Post {...meta}>{post}</Post>
}
