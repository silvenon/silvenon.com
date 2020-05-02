const fsx = require('fs-extra')
const path = require('path')
const yaml = require('yaml')
const { compareDesc } = require('date-fns')
const vfile = require('to-vfile')
const unified = require('unified')
const remarkParse = require('remark-parse')
const remarkStringify = require('remark-stringify')
const detectFrontmatter = require('remark-frontmatter')
const saveFrontmatter = require('./remark-save-frontmatter')
const removeFrontmatter = require('./remark-remove-frontmatter')
const { POSTS_DIR } = require('./consts')

const getPostPathName = (filePath) => {
  return filePath
    .replace(`${process.cwd()}/src/pages`, '')
    .replace('.mdx', '')
    .replace(/\/index$/, '')
}

const getPostFilePaths = async () => {
  const posts = await fsx.readdir(POSTS_DIR)

  const filePaths = await Promise.all(
    posts.map(async (post) => {
      if (path.extname(post) === '.mdx') {
        return `${POSTS_DIR}/${post}`
      }

      const parts = await fsx.readdir(`${POSTS_DIR}/${post}`)

      return parts
        .filter((part) => path.extname(part) === '.mdx')
        .map((part) => `${POSTS_DIR}/${post}/${part}`)
    }),
  )

  return filePaths.flat()
}

const getPostFilePathsSync = () => {
  return fsx
    .readdirSync(POSTS_DIR)
    .map((post) => {
      if (path.extname(post) === '.mdx') {
        return `${POSTS_DIR}/${post}`
      }

      return fsx
        .readdirSync(`${POSTS_DIR}/${post}`)
        .filter((part) => path.extname(part) === '.mdx')
        .map((part) => `${POSTS_DIR}/${post}/${part}`)
    })
    .flat()
}

const {
  process: extractFrontmatter,
  processSync: extractFrontmatterSync,
} = unified()
  .use(remarkParse)
  .use(detectFrontmatter)
  .use(saveFrontmatter)
  .use(removeFrontmatter)
  .use(remarkStringify)

const getPostFrontmatter = async (filePath) => {
  const file = await vfile.read(filePath)
  const { data } = await extractFrontmatter(file)
  return data.frontmatter
}

const getPostFrontmatterSync = (filePath) => {
  const file = vfile.readSync(filePath)
  const { data } = extractFrontmatterSync(file)
  return data.frontmatter
}

const getPostSeries = async (filePath) => {
  const configPath = `${path.dirname(filePath)}/series.yml`
  const configExists = await fsx.exists(configPath)

  if (!configExists) {
    return undefined
  }

  const configContent = await fsx.readFile(configPath)
  const config = yaml.parse(String(configContent))
  const partFiles = await fsx.readdir(path.dirname(filePath))
  const parts = await Promise.all(
    partFiles
      .filter((partFile) => path.extname(partFile) === '.mdx')
      .map(async (partFile) => {
        const fullPath = `${path.dirname(filePath)}/${partFile}`
        const { seriesPart, title } = await getPostFrontmatter(fullPath)
        return {
          order: seriesPart,
          title,
          path: getPostPathName(fullPath),
        }
      }),
  )

  return {
    ...config,
    parts: parts
      .sort((partA, partB) => partA.order - partB.order)
      .map(({ title, path }) => ({ title, path })),
  }
}

const getPostSeriesSync = (filePath) => {
  const configPath = `${path.dirname(filePath)}/series.yml`
  const configExists = fsx.existsSync(configPath)

  if (!configExists) {
    return undefined
  }

  const configContent = fsx.readFileSync(configPath)
  const config = yaml.parse(String(configContent))
  const partFiles = fsx.readdirSync(path.dirname(filePath))
  const parts = partFiles
    .filter((partFile) => path.extname(partFile) === '.mdx')
    .map((partFile) => {
      const fullPath = `${path.dirname(filePath)}/${partFile}`
      const { seriesPart, title } = getPostFrontmatterSync(fullPath)
      return {
        order: seriesPart,
        title,
        path: getPostPathName(fullPath),
      }
    })
    .sort((partA, partB) => partA.order - partB.order)
    .map(({ title, path }) => ({ title, path }))

  return {
    ...config,
    parts,
  }
}

const getAllPostData = async () => {
  const posts = await getPostFilePaths()

  const postData = await Promise.all(
    posts.map(async (post) => ({
      filePath: post,
      frontmatter: await getPostFrontmatter(post),
      path: getPostPathName(post),
      series: await getPostSeries(post),
    })),
  )

  return postData.sort((postA, postB) =>
    compareDesc(
      new Date(postA.frontmatter.published),
      new Date(postB.frontmatter.published),
    ),
  )
}

const getAllPostDataSync = () => {
  return getPostFilePathsSync()
    .map((post) => ({
      filePath: post,
      frontmatter: getPostFrontmatterSync(post),
      path: getPostPathName(post),
      series: getPostSeriesSync(post),
    }))
    .sort((postA, postB) =>
      compareDesc(
        new Date(postA.frontmatter.published),
        new Date(postB.frontmatter.published),
      ),
    )
}

module.exports = {
  getPostPathName,
  getPostFilePaths,
  getPostFilePathsSync,
  getPostFrontmatter,
  getPostFrontmatterSync,
  getPostSeries,
  getPostSeriesSync,
  getAllPostData,
  getAllPostDataSync,
}
