const visit = require('unist-util-visit')
const { omit } = require('lodash')
const sizeOf = require('./image-size')
const cloudinary = require('cloudinary').v2
const { theme } = require('./full-tailwind-config')

// https://cloudinary.com/documentation/responsive_images

module.exports = rehypeCloudinary

// computed in the browser based on font size
// ch unit depends on the typeface!
const proseMaxWidth = {
  DEFAULT: 573.193, // 65ch in 14px
  sm: 655.078, // 65ch in 16px
  lg: 735.82, // 65ch in 18px
  xl: 811.865, // 65ch in 20px
  '2xl': 952.91, // 65ch in 24px
}

// estimation based on values above and varying device DPRs
// rounded to numbers that are powers of two, for aesthetics
const imageSizes = [640, 768, 1024, 1536, 2048]

function rehypeCloudinary() {
  return transformer

  async function transformer(tree) {
    const images = []

    visit(tree, isCloudinaryImage, visitor)

    await Promise.all(
      images.map(async ({ node, index, parent }) => {
        const { width: maxImgWidth, height: maxImgHeight } = await sizeOf(
          getImgUrl({ width: 2048 }),
        )
        const styles = [`--w: ${maxImgWidth};`, `--h: ${maxImgHeight};`]
        if (maxImgWidth < 2048) {
          styles.push(`max-width: ${maxImgWidth / 2}px;`)
        }
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: 'ar',
            style: styles.join(' '),
          },
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: {
                className: 'ar-media',
              },
              children: [
                {
                  ...node,
                  properties: {
                    ...omit(node.properties, ['dataCloudinaryId']),
                    loading: 'lazy',
                    src: getImgUrl({ width: proseMaxWidth['2x'] }),
                    srcSet: imageSizes
                      .filter((width) => width <= maxImgWidth)
                      .map((width) => {
                        return `${getImgUrl({ width })} ${width}w`
                      }),
                    sizes: ['2xl', 'xl', 'lg', 'sm']
                      .map((screen) => {
                        return `(min-width: ${theme.screens[screen]}) ${proseMaxWidth[screen]}px`
                      })
                      .concat('calc(100vw - 2rem)') // subtract padding
                      .join(', '),
                  },
                },
              ],
            },
          ],
        }

        function getImgUrl({ width }) {
          return cloudinary.url(node.properties.dataCloudinaryId, {
            crop: 'limit',
            width,
          })
        }
      }),
    )

    return tree

    function isCloudinaryImage(node) {
      return (
        node.tagName === 'img' &&
        typeof node.properties.dataCloudinaryId !== 'undefined'
      )
    }

    function visitor(node, index, parent) {
      images.push({ node, index, parent })
    }
  }
}
