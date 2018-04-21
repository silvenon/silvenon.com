/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.modifyBabelrc = ({ babelrc }) =>
  Object.assign({}, babelrc, {
    plugins: babelrc.plugins.concat([
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
    ]),
  })
