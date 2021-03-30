import globby from 'globby'
import fsx from 'fs-extra'
import path from 'path'
import yaml from 'js-yaml'

describe('validate posts', () => {
  test.each(
    globby
      .sync('src/posts/**/meta.yml')
      .map((file) => [path.relative('views/posts', file), file]),
  )('%s', async (_, filePath) => {
    const meta = yaml.load(String(await fsx.readFile(filePath)))
    const seriesPath = path.resolve(path.dirname(filePath), '../series.yml')
    const isSeriesPart = await fsx.pathExists(seriesPath)
    const series = isSeriesPart
      ? yaml.load(String(await fsx.readFile(seriesPath)))
      : {}
    // make TypeScript happy
    if (typeof meta !== 'object' || typeof series !== 'object') return
    const postData = { ...series, ...meta }
    expect(postData).toHaveProperty('title')
    expect(postData).toHaveProperty('description')
    if (isSeriesPart) {
      expect(postData).toHaveProperty('seriesPart')
    }
  })
})
