const is = require('unist-util-is')
const findAllBefore = require('unist-util-find-all-before')

const filterTest = ['import', 'export', 'jsx', 'comment']

const getExcerptNodes = ({ marker: markerOption = 1, tree, file } = {}) => {
  let markerTest

  if (typeof markerOption === 'undefined') {
    throw new Error('Expected "marker" to be defined')
  } else if (typeof markerOption === 'string') {
    markerTest = (node) =>
      node.type === 'comment' && node.value.trim() === 'excerpt'
  } else if (typeof markerOption === 'number') {
    const emptyNodeShape = {
      type: 'text',
      value: '\n',
    }
    markerTest =
      tree.children.filter(
        (node) => !is(node, [...filterTest, emptyNodeShape]),
      )[markerOption] || tree.children[tree.children.length - 1]
  } else {
    markerTest = markerOption
  }

  const marker = tree.children.find((node) => is(node, markerTest))

  if (typeof marker === 'undefined') {
    throw new Error(`Unable to find the excerpt marker in ${file.path}`)
  }

  const excerptNodes = findAllBefore(tree, marker)
    .filter((node) => !is(node, filterTest))
    .reverse()

  return excerptNodes
}

module.exports = getExcerptNodes
