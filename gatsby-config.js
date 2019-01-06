const path = require('path')
const prism = require('@mapbox/rehype-prism')
const smartypants = require('./utils/remark-smartypants')

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
    'gatsby-plugin-flow',
    'gatsby-plugin-lodash',
    'gatsby-plugin-postcss',
    'gatsby-plugin-css-customs',
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Lora:400,400i,700:latin-ext'],
        },
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-mdx',
      options: {
        defaultLayouts: {
          posts: require.resolve('./src/components/post.js'),
          drafts: require.resolve('./src/components/post.js'),
          default: require.resolve('./src/components/layout.js'),
        },
        mdPlugins: [smartypants],
        hastPlugins: [prism],
      },
    },
    ...(process.env.NODE_ENV !== 'production'
      ? ['posts', 'drafts']
      : ['posts']
    ).map(name => ({
      resolve: 'gatsby-source-filesystem',
      options: {
        name,
        path: path.resolve(__dirname, `./src/${name}`),
      },
    })),
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: ['/blog/category/*'],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Matija Marohnić',
        short_name: 'Silvenon',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#007faa',
        display: 'minimal-ui',
        icon: 'src/images/icon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-remove-trailing-slashes',
    'gatsby-plugin-netlify',
  ],
}
