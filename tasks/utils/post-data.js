const matter = require('gray-matter')
const path = require('path')
const { formatDateISO } = require('./date')
const { siteUrl } = require('../../site.config')

async function getPostData(file) {
  const slug = file.relative.replace(file.extname, '')
  const relativeUrl = `/blog/${slug}/`
  const url = path.join(siteUrl, relativeUrl)
  const series = slug.includes('/') ? slug.split('/')[0] : null
  const { data: frontmatter } = matter(file.contents.toString())

  return {
    slug,
    url,
    relativeUrl,
    series,
    ...frontmatter,
    published: frontmatter.published
      ? formatDateISO(frontmatter.published)
      : null,
    lastModified: frontmatter.lastModified
      ? formatDateISO(frontmatter.lastModified)
      : null,
  }
}

function getSlug(file) {
  return file.relative.replace(file.extname, '')
}

module.exports = {
  getPostData,
  getSlug,
}
