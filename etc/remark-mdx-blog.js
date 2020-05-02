const u = require('unist-builder')
const { getPostPathName, getPostSeries } = require('./get-post-data')
const { POSTS_DIR } = require('./consts')

const addPathName = (tree, file) => {
  const pathName = getPostPathName(file.path)
  const exportNode = u(
    'export',
    `export const path = ${JSON.stringify(pathName)}`,
  )
  tree.children = [exportNode, ...tree.children]
}

const addSeries = async (tree, file) => {
  const series = await getPostSeries(file.path)

  if (typeof series === 'undefined') {
    return
  }

  const exportNode = u(
    'export',
    `export const series = ${JSON.stringify(series, null, 2)}`,
  )

  tree.children = [exportNode, ...tree.children]
}

const remarkMdxBlog = () => async (tree, file) => {
  if (!file.path.startsWith(POSTS_DIR)) {
    return
  }

  addPathName(tree, file)
  await addSeries(tree, file)
}

module.exports = remarkMdxBlog
