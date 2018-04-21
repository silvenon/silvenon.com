/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.modifyBabelrc = ({ babelrc }) => ({
  ...babelrc,
  plugins: [
    ...babelrc.plugins,
    'polished',
    [
      'emotion',
      process.env.NODE_ENV === 'production'
        ? {
            hoist: true,
          }
        : {
            sourceMap: true,
            autoLabel: true,
          },
    ],
  ],
})
