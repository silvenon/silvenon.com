import { LoaderFunction } from 'remix'
import { Feed } from 'feed'
import { compareDesc } from 'date-fns'
import path from 'path'
import cloudinary from '~/utils/cloudinary'
import { db } from '~/utils/db.server'
import { author } from '~/consts'

type ElementType<T> = T extends Array<infer U> ? U : never

async function getPosts() {
  const standalonePosts = await db.standalonePost.findMany({
    ...(process.env.NODE_ENV === 'production'
      ? { where: { published: { not: null } } }
      : null),
    select: {
      slug: true,
      title: true,
      description: true,
      published: true,
    },
  })
  const series = await db.series.findMany({
    ...(process.env.NODE_ENV === 'production'
      ? { where: { published: { not: null } } }
      : null),
    select: {
      slug: true,
      title: true,
      description: true,
      published: true,
      parts: {
        select: {
          slug: true,
          title: true,
          description: true,
        },
        orderBy: {
          seriesPart: 'asc',
        },
      },
    },
  })
  const posts: Array<
    ElementType<typeof standalonePosts> | ElementType<typeof series>
  > = [...standalonePosts, ...series]
  return posts.sort((a, b) => {
    if (!a.published) return -1
    if (!b.published) return 1
    return compareDesc(a.published, b.published)
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  if (!host) {
    throw new Error('Could not determine domain URL.')
  }
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const domain = `${protocol}://${host}`

  const feed = new Feed({
    title: `${author.name}'s blog`,
    description: 'A blog about frontend and DX development',
    id: domain,
    link: domain,
    language: 'en-US',
    image: cloudinary('in-reactor-1.jpg', { version: 3 }),
    favicon: `${domain}/favicon.ico`,
    author,
    copyright: '',
  })

  // ???

  const posts = await getPosts()

  for (const post of posts) {
    if ('parts' in post) {
      const series = post
      if (!series.published) continue
      for (const part of series.parts) {
        const pathname = `blog/${series.slug}/${part.slug}`
        feed.addItem({
          title: `${series.title}: ${part.title}`,
          id: path.join(domain, pathname),
          link: path.join(domain, pathname),
          description: part.description,
          author: [author],
          date: series.published,
        })
      }
    } else {
      if (!post.published) continue
      const pathname = `/blog/${post.slug}`
      feed.addItem({
        title: post.title,
        id: path.join(domain, pathname),
        link: path.join(domain, pathname),
        description: post.description,
        author: [author],
        date: post.published,
      })
    }
  }

  const rssString = feed.rss2()

  return new Response(rssString, {
    headers: {
      'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(rssString)),
    },
  })
}
