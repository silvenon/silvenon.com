import globby from 'globby'
import fsx from 'fs-extra'
import path from 'path'
import yaml from 'js-yaml'
import { PostMeta } from '../../posts'

describe('validate posts', () => {
  test.each(
    globby
      .sync('src/posts/**/meta.yml')
      .map((file) => [path.relative('views/posts', file), file]),
  )('%s', async (_, filePath) => {
    const postMeta = yaml.load(String(await fsx.readFile(filePath))) as PostMeta
    const seriesPath = path.resolve(path.dirname(filePath), '../series.yml')
    const isSeriesPart = await fsx.pathExists(seriesPath)
    expect(postMeta).toHaveProperty('title')
    expect(postMeta).toHaveProperty('description')
    // Google truncates descriptions after 160
    expect(postMeta.description.length).toBeLessThanOrEqual(160)
    if (isSeriesPart) {
      expect(postMeta).toHaveProperty('seriesPart')
    }
  })
})
