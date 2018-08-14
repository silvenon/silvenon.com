const visit = require('unist-util-visit')

// moves language classes from <code> to <pre> tags
// in order for Prism themes to work better

module.exports = () => {
  const transformer = tree => {
    visit(tree, 'element', node => {
      if (node.tagName === 'pre' && node.children[0].tagName === 'code') {
        const [codeNode] = node.children
        if (codeNode.properties.className == null) return
        const languageClassName = codeNode.properties.className.find(
          className => className.startsWith('language-'),
        )
        codeNode.properties.className = codeNode.properties.className.filter(
          className => className !== languageClassName,
        )
        // eslint-disable-next-line no-param-reassign
        node.properties.className = [
          ...(node.properties.className || []),
          languageClassName,
        ]
      }
    })
  }
  return transformer
}
