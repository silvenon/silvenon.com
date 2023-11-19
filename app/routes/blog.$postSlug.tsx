import { useLoaderData } from '@remix-run/react'
import { redirect } from '@remix-run/node'
import type { V2_MetaFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getMeta } from '~/utils/seo'
import { author } from '~/consts'
import Post from '~/components/Post'
import { getSeries, getStandalonePost } from '~/utils/posts.server'
import { formatDateISO } from '~/utils/date'
import { loader as catchallLoader } from './$'

export async function loader(args: LoaderArgs) {
  const { params } = args
  invariant(params.postSlug, 'slug is required')

  const series = await getSeries(params.postSlug)
  if (series !== null) {
    return redirect(`/blog/${series.slug}/${series.parts[0].slug}`, 302)
  }
  const post = await getStandalonePost(params.postSlug)
  if (!post) return catchallLoader(args)

  return json({
    slug: post.slug,
    title: post.title,
    description: post.description,
    htmlTitle: post.htmlTitle,
    published: post.published,
    lastModified: post.lastModified,
    code: post.output,
  })
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  // type of data is incorrect, in case of an error it's undefined
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
  return <Post {...data} />
}
