const path = require('path')
const headingsSlugId = require('rehype-slug')
const autolinkHeadings = require('rehype-autolink-headings')
const smartypants = require('@silvenon/remark-smartypants')

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
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              noInlineHighlight: true,
            },
          },
        ],
        remarkPlugins: [smartypants],
        rehypePlugins: [
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
                    exports: { meta: { isHidden: { eq: false }, language: { eq: "EN" } } }
                  }
                ) {
                  edges {
                    node {
                      fields {
                        path
                        date
                        isSeries
                        seriesTitle
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
              allMdx.edges
                .sort((edgeA, edgeB) => {
                  if (
                    !edgeA.node.fields.isSeries ||
                    !edgeB.node.fields.isSeries
                  ) {
                    return 0
                  }
                  return (
                    edgeB.node.exports.meta.seriesPart -
                    edgeA.node.exports.meta.seriesPart
                  )
                })
                .map(({ node }) => ({
                  title: node.fields.isSeries
                    ? `${node.fields.seriesTitle}: ${node.exports.meta.title}`
                    : node.exports.meta.title,
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
