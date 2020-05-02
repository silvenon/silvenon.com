const { toJSX } = require('@mdx-js/mdx/mdx-hast-to-jsx')
const u = require('unist-builder')
const getExcerptNodes = require('./get-excerpt-nodes')

// TODO: support `components` and...?

const getExportNode = (excerptNodes, tree) => {
  const excerpt = excerptNodes.map((node) => toJSX(node, tree)).join('')

  return u(
    'export',
    `export const Excerpt = function MDXExcerpt() {\n  return <>${excerpt}</>\n}`,
  )
}

const rehypeMdxExcerpt = (marker = 1) => (tree, file) => {
  const excerptNodes = getExcerptNodes({ marker, tree, file })
  const insertIndex =
    tree.children.indexOf(excerptNodes[excerptNodes.length - 1]) + 1

  tree.children.splice(
    insertIndex,
    typeof marker === 'number' ? 0 : 1,
    getExportNode(excerptNodes, tree),
  )
}

module.exports = rehypeMdxExcerpt
