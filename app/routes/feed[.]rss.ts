import type { LoaderFunction } from '@remix-run/node'
import { Feed } from 'feed'
import path from 'node:path'
import cloudinary from '~/utils/cloudinary'
import { getAllPostsMeta } from '~/utils/posts.server'
import { getDomainUrl } from '~/utils/http'
import { author } from '~/consts'

export const loader: LoaderFunction = async ({ request }) => {
  const domain = getDomainUrl(request)

  const feed = new Feed({
    title: `${author.name}'s blog`,
    description: 'A blog about frontend and DX development',
    id: domain,
    link: domain,
    language: 'en-US',
    image: cloudinary('in-reactor-1.jpg', { version: 3, quality: 'auto' }),
    favicon: `${domain}/favicon.ico`,
    author,
    copyright: '',
  })

  const entries = await getAllPostsMeta()

  for (const entry of entries) {
    if ('source' in entry) {
      if ('parts' in entry) {
        const externalSeries = entry
        for (const part of externalSeries.parts) {
          feed.addItem({
            title: `${externalSeries.title}: ${part.title}`,
            id: part.url,
            link: part.url,
            description: part.description,
            author: [author],
            date: new Date(part.published),
          })
        }
      } else {
        feed.addItem({
          title: entry.title,
          id: entry.url,
          link: entry.url,
          description: entry.description,
          author: [author],
          date: new Date(entry.published),
        })
      }
    } else if ('parts' in entry) {
      const series = entry
      if (!series.published) continue
      for (const part of series.parts) {
        const pathname = `blog/${series.slug}/${part.slug}`
        feed.addItem({
          title: `${series.title}: ${part.title}`,
          id: path.join(domain, pathname),
          link: path.join(domain, pathname),
          description: part.description,
          author: [author],
          date: new Date(series.published),
        })
      }
    } else {
      if (!entry.published) continue
      const pathname = `/blog/${entry.slug}`
      feed.addItem({
        title: entry.title,
        id: path.join(domain, pathname),
        link: path.join(domain, pathname),
        description: entry.description,
        author: [author],
        date: new Date(entry.published),
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
