import { Feed } from 'feed'
import fsx from 'fs-extra'
import dateFns from 'date-fns'
import cl from '../cloudinary'
import { posts, Post } from '../posts'
import { SITE_URL, author } from '../consts'

export async function generateFeed() {
  const feed = new Feed({
    title: author.name,
    description: 'My blog about frontend and DX development',
    id: SITE_URL,
    link: SITE_URL,
    language: 'en-US',
    image: cl('in-reactor-1.jpg', { version: 3 }),
    favicon: `${SITE_URL}/favicon.ico`,
    feedLinks: {
      atom: `${SITE_URL}/feeds/atom.xml`,
    },
    author,
    copyright: '',
  })

  // https://kentcdodds.com/blog/typescript-function-syntaxes#type-guards
  function isPublished(post: Post): post is Post & { published: string } {
    return Boolean(post.published)
  }

  const publishedPosts = posts.filter(isPublished)

  for (const post of publishedPosts) {
    const url = `${SITE_URL}${post.pathname}`
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      author: [author],
      date: dateFns.parseISO(post.published),
    })
  }

  await fsx.outputFile('dist/feeds/atom.xml', feed.atom1())
}
