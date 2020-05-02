const yaml = require('yaml')
const visit = require('unist-util-visit')

const remarkSaveFrontmatter = (options = {}) => {
  const { key = 'frontmatter' } =
    typeof options === 'string' ? { key: options } : options

  return (tree, file) => {
    visit(tree, 'yaml', (node) => {
      file.data[key] = yaml.parse(node.value)
    })
  }
}

module.exports = remarkSaveFrontmatter
