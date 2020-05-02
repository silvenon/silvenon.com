const { Feed } = require('feed')
const fsx = require('fs-extra')
const vfile = require('to-vfile')
const unified = require('unified')
const remarkParse = require('remark-parse')
const remarkMdx = require('remark-mdx')
const remarkRetext = require('remark-retext')
const detectFrontmatter = require('remark-frontmatter')
const retextStringify = require('retext-stringify')
const retextLatin = require('retext-latin')
const removeFrontmatter = require('./remark-remove-frontmatter')
const { getAllPostData } = require('./get-post-data')
const getExcerptNodes = require('./get-excerpt-nodes')

const SITE_URL = 'https://silvenon.com'

const remarkExcerpt = () => (tree, file) => {
  const excertpNodes = getExcerptNodes({ tree, file })
  tree.children = excertpNodes
}

const createFeed = async () => {
  const feed = new Feed({
    title: `Matija Marohnić`,
    description: 'My blog about frontend and DX development',
    id: SITE_URL,
    link: SITE_URL,
    language: 'en-US',
    image:
      'https://res.cloudinary.com/silvenon/image/upload/v1510308691/avatar.jpg',
    favicon: `${SITE_URL}/favicon.ico`,
    updated: new Date(),
    feedLinks: {
      atom: `${SITE_URL}/atom.xml`,
    },
    author: {
      name: 'Matija Marohnić',
      email: 'matija.marohnic@gmail.com',
      link: SITE_URL,
    },
  })

  const posts = await getAllPostData()

  const { process: extractExcerpt } = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(detectFrontmatter)
    .use(removeFrontmatter)
    .use(remarkExcerpt)
    .use(remarkRetext, retextLatin.Parser)
    .use(retextStringify)

  const postsWithExcerpt = await Promise.all(
    posts.map(async (post) => {
      const { contents } = await extractExcerpt(await vfile.read(post.filePath))
      return {
        ...post,
        excerpt: contents,
      }
    }),
  )

  postsWithExcerpt.forEach(({ frontmatter, path, series, excerpt }) => {
    feed.addItem({
      title:
        typeof series === 'undefined'
          ? frontmatter.title
          : `${series.title}: ${frontmatter.title}`,
      id: `${SITE_URL}${path}`,
      link: `${SITE_URL}${path}`,
      description: excerpt,
      author: [
        {
          name: 'Matija Marohnić',
          email: 'matija.marohnic@gmail.com',
          link: SITE_URL,
        },
      ],
      date: new Date(frontmatter.published),
    })
  })

  const atomPath = `${process.cwd()}/out/feeds/atom.xml`

  await fsx.ensureFile(atomPath)
  await fsx.writeFile(atomPath, feed.atom1())
}

module.exports = createFeed
