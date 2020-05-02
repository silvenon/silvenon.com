const sitemap = require('nextjs-sitemap-generator')

const createSitemap = async () => {
  await sitemap({
    baseUrl: 'https://silvenon.com',
    ignoreIndexFiles: true,
    pagesDirectory: `${process.cwd()}/out`,
    targetDirectory: `${process.cwd()}/out`,
    ignoredExtensions: ['ico', 'xml'],
  })
}

module.exports = createSitemap
