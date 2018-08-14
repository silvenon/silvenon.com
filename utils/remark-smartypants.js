const retext = require('retext')
const visit = require('unist-util-visit')
const smartypants = require('retext-smartypants')

module.exports = options => {
  const processor = retext().use(smartypants, options)
  const transformer = tree => {
    visit(tree, 'text', node => {
      // eslint-disable-next-line no-param-reassign
      node.value = String(processor.processSync(node.value))
    })
  }
  return transformer
}
