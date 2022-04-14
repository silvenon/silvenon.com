import { useLoaderData, useCatch } from '@remix-run/react'
import { redirect } from '@remix-run/node'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { bundleMDXPost } from '~/utils/mdx.server'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import Prose from '~/components/Prose'
import NotFound from '~/components/NotFound'
import { getSeries, getStandalonePost } from '~/utils/posts.server'
import { formatDateISO } from '~/utils/date'

export interface LoaderData {
  slug: string
  htmlTitle?: string
  title: string
  description: string
  published?: Date
  lastModified?: Date
  code: string
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.postSlug, 'slug is required')
  const series = await getSeries(params.postSlug)
  if (series !== null) {
    return redirect(`/blog/${series.slug}/${series.parts[0].slug}`, 302)
  }
  const post = await getStandalonePost(params.postSlug)
  if (!post) throw new Response('Not Found', { status: 404 })
  try {
    const code = await bundleMDXPost(post.content)
    const data: LoaderData = {
      slug: post.slug,
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

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <Prose as="main" className="py-4 text-center">
      {caught.status === 404 ? (
        <NotFound title="Post Not Found">
          <p>
            It&apos;s likely that you got here by following a link to one of my
            blog posts which no longer has that URL. You should be able to find
            the content you&apos;re looking for elsewhere on this site, unless I
            deleted that post!{' '}
            <span role="img" aria-label="embarrassed">
              😳
            </span>
          </p>
        </NotFound>
      ) : (
        <h1>
          <span className="text-amber-600">{caught.status}</span>{' '}
          {caught.statusText}
        </h1>
      )}
    </Prose>
  )
}
