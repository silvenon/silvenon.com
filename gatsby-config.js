const path = require('path')
const prism = require('@mapbox/rehype-prism')
const smartypants = require('./utils/remark-smartypants')
const codeLanguageFix = require('./utils/rehype-code-language-fix')

module.exports = {
  siteMetadata: {
    siteUrl: 'https://silvenon.com',
    name: 'Matija Marohnić',
    avatar: {
      id: 'avatar',
      aspectRatio: 1 / 1,
    },
    biography: {
      short: 'A design-savvy frontend developer from Croatia.',
      long: [
        'A design-savvy frontend developer from Croatia.',
        'I love React and enjoy creating delightful, maintainable UIs.',
        'Besides frontend, I also like to write about love, sex and relationships.',
      ].join(' '),
    },
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-lodash',
    {
      resolve: 'gatsby-plugin-emotion',
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
    {
      resolve: 'gatsby-mdx',
      options: {
        defaultLayouts: {
          posts: require.resolve('./src/components/post.js'),
          drafts: require.resolve('./src/components/post.js'),
          default: require.resolve('./src/components/layout.js'),
        },
        mdPlugins: [smartypants],
        hastPlugins: [prism, codeLanguageFix],
      },
    },
    ...(process.env.NODE_ENV !== 'production'
      ? ['posts', 'drafts']
      : ['posts']
    ).map(name => ({
      resolve: 'gatsby-source-filesystem',
      options: {
        name,
        path: path.resolve(`./src/${name}`),
      },
    })),
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: ['/blog/category/*'],
      },
    },
    'gatsby-plugin-netlify',
  ],
}
