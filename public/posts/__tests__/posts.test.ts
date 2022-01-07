import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const posts: string[] = []
for (const dirent of fs.readdirSync(`${__dirname}/..`, {
  withFileTypes: true,
})) {
  if (dirent.isFile()) {
    posts.push(`${__dirname}/../${dirent.name}`)
  } else {
    if (dirent.name === '__tests__') continue
    for (const subDirent of fs.readdirSync(`${__dirname}/../${dirent.name}`, {
      withFileTypes: true,
    })) {
      if (subDirent.name === 'series.json') continue
      if (subDirent.isFile()) {
        posts.push(`${__dirname}/../${dirent.name}/${subDirent.name}`)
      }
    }
  }
}

describe('validate posts', () => {
  test.each(posts)('%s', async (filePath) => {
    const frontmatter = matter(
      await fs.promises.readFile(filePath, 'utf-8'),
    ).data
    expect(frontmatter).toHaveProperty('title')
    expect(frontmatter).toHaveProperty('description')
    // Google truncates descriptions after 160
    expect(frontmatter.description.length).toBeLessThanOrEqual(160)
    try {
      await fs.promises.open(`${path.dirname(filePath)}/series.json`, 'r')
      expect(frontmatter).toHaveProperty('seriesPart')
    } catch (err) {
      // series.json doesn't exist, so post is not a series, do nothing
    }
  })
})
