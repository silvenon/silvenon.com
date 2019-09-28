/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path')
const paginate = require('./utils/paginate')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'Mdx') {
    const fileNode = getNode(node.parent)
    const isDraft = fileNode.sourceInstanceName === 'drafts'
    const [date, slug] = isDraft
      ? [fileNode.modifiedTime, fileNode.relativeDirectory]
      : fileNode.relativeDirectory.split('_')
    if (/^\d+-\d+-\d+/.test(slug)) {
      throw new Error(
        `Invalid file name format: "${fileNode.relativeDirectory}"`,
      )
    }
    createNodeField({
      node,
      name: 'date',
      value: date,
    })
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
    createNodeField({
      node,
      name: 'path',
      value: `/blog/${slug}`,
    })
    createNodeField({
      node,
      name: 'isDraft',
      value: isDraft,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMdx(sort: { fields: [fields___date], order: DESC }) {
        edges {
          node {
            id
            fields {
              date
              path
            }
            exports {
              meta {
                title
                language
                isHidden
              }
            }
          }
        }
      }
    }
  `)

  if (result.errors != null) {
    // eslint-disable-next-line no-console
    console.error(result.errors)
  } else {
    const blogPosts = result.data.allMdx.edges
    const blogTemplate = path.resolve('./src/templates/blog.js')
    const postTemplate = path.resolve('./src/templates/post.js')
    const languages = ['EN', 'HR']
    const perPage = 7

    paginate({
      createPage,
      basePath: `/blog`,
      component: blogTemplate,
      edges: blogPosts,
      perPage,
    })

    languages.forEach(language => {
      paginate({
        createPage,
        basePath: `/blog/language/${language.toLowerCase()}`,
        component: blogTemplate,
        edges: blogPosts.filter(
          ({ node }) => node.exports.meta.language === language,
        ),
        perPage,
        context: { language },
      })
    })

    blogPosts.forEach(({ node }) => {
      if (languages.indexOf(node.exports.meta.language) === -1) {
        throw new Error(
          `Unrecognized language "${node.exports.meta.language}" for blog post "${node.exports.meta.title}"`,
        )
      }

      const readNextCandidates = blogPosts.filter(
        ({ node: n }) =>
          !n.exports.meta.isHidden &&
          n.exports.meta.language === node.exports.meta.language,
      )
      const currentIndex = readNextCandidates.findIndex(
        ({ node: n }) => n.id === node.id,
      )
      const readNext =
        currentIndex !== -1 ? readNextCandidates[currentIndex + 1] : null

      createPage({
        path: node.fields.path,
        component: postTemplate,
        context: {
          id: node.id,
          readNext:
            readNext != null
              ? {
                  title: readNext.node.exports.meta.title,
                  path: readNext.node.fields.path,
                }
              : null,
        },
      })
    })
  }
}
