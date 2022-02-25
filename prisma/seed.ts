import { PrismaClient } from '@prisma/client'
import matter from 'gray-matter'
import fs from 'fs/promises'
import path from 'path'
import { parseISO } from 'date-fns'

const db = new PrismaClient()

const ROOT_DIR = `${__dirname}/..`

async function seed() {
  await db.admin.create({
    data: {
      email: 'matija.marohnic@gmail.com',
      passwordHash:
        '$2b$10$XXxWQHJq5mEXC9RLUnVP3u4qfXmf.W4DLDl8bFW5g/vRj6UdlZWsG',
      name: 'Matija',
    },
  })

  const postOrSeriesBasenames = await fs.readdir(`${ROOT_DIR}/app/posts`, {
    withFileTypes: true,
  })

  await Promise.all(
    postOrSeriesBasenames
      .filter((dirent) => dirent.name !== '__tests__')
      .map(async (dirent) => {
        if (dirent.isFile()) {
          const { content, data: frontmatter } = matter(
            await fs.readFile(`${ROOT_DIR}/app/posts/${dirent.name}`, 'utf8'),
          )
          await db.standalonePost.create({
            data: {
              slug: path.basename(dirent.name, '.mdx'),
              content,
              ...frontmatter,
              title: frontmatter.title,
              htmlTitle: frontmatter.htmlTitle,
              description: frontmatter.description,
              category: frontmatter.category,
              published: frontmatter.published,
              lastModified: frontmatter.lastModified,
              tweet: frontmatter.tweet,
            },
          })
        } else {
          const seriesSlug = dirent.name
          const series = JSON.parse(
            await fs.readFile(
              `${ROOT_DIR}/app/posts/${seriesSlug}/series.json`,
              'utf8',
            ),
          )
          await db.series.create({
            data: {
              slug: seriesSlug,
              title: series.title,
              htmlTitle: series.htmlTitle,
              description: series.description,
              published: parseISO(series.published),
              tweet: series.tweet,
            },
          })
          const partDirents = await fs.readdir(
            `${ROOT_DIR}/app/posts/${seriesSlug}`,
            { withFileTypes: true },
          )
          await Promise.all(
            partDirents
              .filter((dirent) => dirent.name.endsWith('.mdx'))
              .map(async (dirent) => {
                const { content, data: frontmatter } = matter(
                  await fs.readFile(
                    `${ROOT_DIR}/app/posts/${seriesSlug}/${dirent.name}`,
                    'utf8',
                  ),
                )
                await db.seriesPart.create({
                  data: {
                    slug: path.basename(dirent.name, '.mdx'),
                    title: frontmatter.title,
                    htmlTitle: frontmatter.htmlTitle,
                    description: frontmatter.description,
                    category: frontmatter.category,
                    content,
                    lastModified: frontmatter.lastModified,
                    seriesPart: frontmatter.seriesPart,
                    seriesSlug,
                  },
                })
              }),
          )
        }
      }),
  )
}

seed()
