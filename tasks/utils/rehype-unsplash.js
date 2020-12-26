const visit = require('unist-util-visit')
const { omit } = require('lodash')

module.exports = rehypeUnsplash

function rehypeUnsplash() {
  return transformer

  function transformer(tree) {
    visit(tree, isUnsplashImage, visitor)

    return tree

    function isUnsplashImage(node) {
      return (
        node.tagName === 'img' &&
        typeof node.properties.dataUnsplash !== 'undefined'
      )
    }

    function visitor(node, i, parent) {
      parent.children[i] = {
        type: 'element',
        tagName: 'figure',
        children: [
          {
            ...node,
            properties: omit(node.properties, [
              'dataUnsplash',
              'dataName',
              'dataUsername',
            ]),
          },
          {
            type: 'element',
            tagName: 'figcaption',
            children: [
              {
                type: 'element',
                tagName: 'span',
                children: [{ type: 'text', value: 'Photo by ' }],
              },
              {
                type: 'element',
                tagName: 'a',
                properties: {
                  href: `https://unsplash.com/@${node.properties.dataUsername}?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText`,
                },
                children: [{ type: 'text', value: node.properties.dataName }],
              },
              {
                type: 'element',
                tagName: 'span',
                children: [{ type: 'text', value: ' on ' }],
              },
              {
                type: 'element',
                tagName: 'a',
                properties: {
                  href:
                    'https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText',
                },
                children: [{ type: 'text', value: 'Unsplash' }],
              },
            ],
          },
        ],
      }
    }
  }
}
