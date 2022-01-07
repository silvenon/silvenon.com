import { LoaderFunction } from 'remix'
import { Feed } from 'feed'
import { parseISO as parseISODate } from 'date-fns'
import path from 'path'
import cloudinary from '~/utils/cloudinary'
import { getAllPosts } from '~/utils/posts.server'
import { author } from '~/consts'

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

  const posts = await getAllPosts()

  for (const post of posts) {
    if ('parts' in post) {
      const series = post
      if (!series.published) continue
      for (const part of series.parts) {
        feed.addItem({
          title: `${series.title}: ${part.title}`,
          id: `${path.join(domain, part.pathname)}`,
          link: `${path.join(domain, part.pathname)}`,
          description: part.description,
          author: [author],
          date: parseISODate(series.published),
        })
      }
    } else {
      if (!post.published) continue
      feed.addItem({
        title: post.title,
        id: `${path.join(domain, post.pathname)}`,
        link: `${path.join(domain, post.pathname)}`,
        description: post.description,
        author: [author],
        date: parseISODate(post.published),
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
