const matter = require('gray-matter')
const globby = require('globby')
const fsx = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

describe('validate posts', () => {
  test.each(
    globby
      .sync('views/posts/**/*.md')
      .map((file) => [path.relative('views/posts', file), file]),
  )('%s', async (_, filePath) => {
    const { data: frontmatter } = await matter(await fsx.readFile(filePath))
    const seriesPath = path.join(path.dirname(filePath), 'series.yml')
    const isSeriesPart = await fsx.pathExists(seriesPath)
    const series = isSeriesPart ? yaml.load(await fsx.readFile(seriesPath)) : {}
    const postData = { ...series, ...frontmatter }
    expect(postData).toHaveProperty('title')
    expect(postData).toHaveProperty('description')
    if (!postData.draft) {
      expect(postData).toHaveProperty('published')
    }
    if (isSeriesPart) {
      expect(postData).toHaveProperty('seriesPart')
    }
  })
})
