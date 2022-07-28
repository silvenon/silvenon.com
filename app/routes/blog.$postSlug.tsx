import { useLoaderData, useCatch } from '@remix-run/react'
import { redirect } from '@remix-run/node'
import type { MetaFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import Boundary from '~/components/Boundary'
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

export async function loader({ params }: LoaderArgs) {
  invariant(params.postSlug, 'slug is required')
  const series = await getSeries(params.postSlug)
  if (series !== null) {
    return redirect(`/blog/${series.slug}/${series.parts[0].slug}`, 302)
  }
  const post = await getStandalonePost(params.postSlug)
  if (!post) throw new Response('Post not found', { status: 404 })
  try {
    return json<LoaderData>({
      slug: post.slug,
      title: post.title,
      description: post.description,
      htmlTitle: post.htmlTitle,
      published: post.published,
      lastModified: post.lastModified,
      code: post.output,
    })
  } catch (err) {
    throw new Response('Failed to compile blog post', { status: 500 })
  }
}

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => {
  const { title, description, published, lastModified } = data ?? {}
  return {
    ...(title && description
      ? getMeta({
          type: 'article',
          title,
          description,
        })
      : getMeta({
          title: 'Post not found',
        })),
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
  const data = useLoaderData<typeof loader>()
  return <Post {...data} />
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <Boundary
      status={caught.status}
      title={caught.data ?? caught.statusText}
      description={
        caught.status === 404 ? (
          <>
            It&apos;s likely that you got here by following a link to one of my
            blog posts which no longer has that URL. You should be able to find
            the content you&apos;re looking for elsewhere on this site, unless I
            deleted that post!{' '}
            <span role="img" aria-label="embarrassed">
              😳
            </span>
          </>
        ) : null
      }
    />
  )
}
