const path = require('path')
const prism = require('@mapbox/rehype-prism')
const headingsSlugId = require('rehype-slug')
const autolinkHeadings = require('rehype-autolink-headings')
const smartypants = require('./utils/remark-smartypants')

module.exports = {
  siteMetadata: {
    siteUrl: 'https://silvenon.com',
    title: 'Silvenon',
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
    'gatsby-plugin-postcss',
    'gatsby-plugin-css-customs',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-mdx',
      options: {
        remarkPlugins: [smartypants],
        rehypePlugins: [
          prism,
          headingsSlugId,
          [
            autolinkHeadings,
            {
              properties: {
                ariaHidden: true,
                dataAutolink: true,
              },
              content: [],
            },
          ],
        ],
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
    'gatsby-plugin-remove-trailing-slashes',
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: ['/blog/category/*'],
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                siteUrl
                site_url: siteUrl,
              }
            }
          }
        `,
        setup: ({ query: { site } }) => ({
          ...site.siteMetadata,
          feed_url: `${site.siteMetadata.siteUrl}/rss.xml`,
        }),
        feeds: [
          {
            query: `
              {
                allMdx(
                  sort: { fields: [fields___date], order: DESC }
                  filter: {
                    exports: { meta: { isHidden: { eq: false }, lang: { eq: "EN" } } }
                  }
                ) {
                  edges {
                    node {
                      fields {
                        path
                        date
                      }
                      exports {
                        meta {
                          title
                        }
                      }
                      excerpt
                    }
                  }
                }
              }
            `,
            serialize: ({ query: { site, allMdx } }) =>
              allMdx.edges.map(({ node }) => ({
                title: node.exports.meta.title,
                description: node.excerpt,
                date: node.fields.date,
                url: `${site.siteMetadata.siteUrl}${node.fields.path}`,
              })),
            output: 'rss.xml',
          },
        ],
      },
    },
    'gatsby-plugin-netlify',
  ],
}
