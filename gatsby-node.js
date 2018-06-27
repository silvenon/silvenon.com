/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin(
    {
      name: 'babel-plugin-lodash',
    },
    {
      name: 'babel-plugin-polished',
    },
    {
      name: 'babel-plugin-emotion',
      options:
        process.env.NODE_ENV === 'production'
          ? {
              hoist: true,
            }
          : {
              sourceMap: true,
              autoLabel: true,
            },
    },
  )
}
