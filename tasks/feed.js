const { Feed } = require('feed')
const fsx = require('fs-extra')
const dateFns = require('date-fns')
const cloudinary = require('cloudinary').v2
const { collectedData } = require('./views')
const { destDir, siteUrl } = require('../site.config')

const matija = {
  name: 'Matija Marohnić',
  email: 'matija.marohnic@gmail.com',
  link: siteUrl,
}

async function createFeed() {
  const feed = new Feed({
    title: 'Matija Marohnić',
    description: 'My blog about frontend and DX development',
    id: siteUrl,
    link: siteUrl,
    language: 'en-US',
    image: cloudinary.url('in-reactor-1.jpg', { version: 3 }),
    favicon: `${siteUrl}/favicon.ico`,
    feedLinks: {
      atom: `${siteUrl}/feeds/atom.xml`,
    },
    author: matija,
  })

  collectedData.posts.forEach((post) => {
    feed.addItem({
      title:
        post.series === null
          ? post.title
          : `${post.seriesTitle}: ${post.title}`,
      id: post.url,
      link: post.url,
      description: post.description,
      author: [matija],
      date: dateFns.parseISO(post.published),
    })
  })

  await fsx.outputFile(`${destDir}/feeds/atom.xml`, feed.atom1())
}

module.exports = createFeed
