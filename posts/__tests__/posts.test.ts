// @vitest-environment node
import path from 'node:path'
import type {
  StandalonePostFrontmattter,
  SeriesPostFrontmatter,
  SeriesMeta,
} from '~/utils/posts.server'

const postModules = {
  ...import.meta.glob<StandalonePostFrontmattter>('/posts/*.mdx', {
    import: 'frontmatter',
    eager: true,
  }),
  ...import.meta.glob<SeriesPostFrontmatter>('/posts/*/*.mdx', {
    import: 'frontmatter',
    eager: true,
  }),
  ...import.meta.glob<SeriesMeta>('/posts/*/series.json', {
    import: 'default',
    eager: true,
  }),
}

describe('validate posts', () => {
  test.each(
    Object.keys(postModules)
      .filter((importPath) => {
        const meta = postModules[importPath]
        if ('seriesPart' in meta) {
          return (
            'published' in
            postModules[path.join(path.dirname(importPath), 'series.json')]
          )
        }
        return 'published' in meta
      })
      .map((importPath) => [path.relative('/posts', importPath), importPath]),
  )('%s', async (basename, importPath) => {
    const meta = postModules[importPath]
    expect(meta).toHaveProperty('title')
    expect(meta).toHaveProperty('description')
    // recommended by Ahrefs
    expect(meta.description.length).toBeGreaterThan(110)
    // Google truncates descriptions after 160
    expect(meta.description.length).toBeLessThanOrEqual(160)
    if (basename.includes('/')) {
      const seriesImportPath = path.join(
        path.dirname(importPath),
        'series.json',
      )
      expect(postModules).toHaveProperty(seriesImportPath)
    }
  })
})
