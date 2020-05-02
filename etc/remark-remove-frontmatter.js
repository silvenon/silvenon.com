const remove = require('unist-util-remove')

const remarkRemoveFrontmatter = (type = 'yaml') => (tree) => {
  remove(tree, type)
}

module.exports = remarkRemoveFrontmatter
