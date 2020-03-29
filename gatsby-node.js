/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const yaml = require('js-yaml')
const fs = require('fs-extra')
const path = require('path')
const paginate = require('./utils/paginate')

exports.onCreateNode = async ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'Mdx') {
    const fileNode = getNode(node.parent)
    const isSeries = fileNode.name !== 'index'
    const isDraft = fileNode.sourceInstanceName === 'drafts'
    const [date, slugBase] = isDraft
      ? [fileNode.modifiedTime, fileNode.relativeDirectory]
      : fileNode.relativeDirectory.split('_')

    if (slugBase == null && !slugBase) {
      throw new Error(
        `Missing date in published post "${fileNode.relativeDirectory}". It should be separated from the slug with an underscore.`,
      )
    }

    const slug =
      fileNode.name === 'index' ? slugBase : `${slugBase}/${fileNode.name}`

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
      name: 'isSeries',
      value: isSeries,
    })
    if (isSeries) {
      const seriesMeta = yaml.safeLoad(
        await fs.readFile(
          fileNode.absolutePath.replace(fileNode.base, 'series.yml'),
        ),
      )
      createNodeField({
        node,
        name: 'seriesId',
        value: slugBase,
      })
      createNodeField({
        node,
        name: 'seriesPath',
        value: `/blog/${slugBase}`,
      })
      createNodeField({
        node,
        name: 'seriesTitle',
        value: seriesMeta.title,
      })
    }
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
      allMdx(sort: { fields: fields___date, order: DESC }) {
        edges {
          node {
            id
            fields {
              date
              path
              isSeries
              seriesId
              seriesPath
            }
            exports {
              meta {
                title
                language
                isHidden
                seriesPart
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

    languages.forEach((language) => {
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

    await Promise.all(
      blogPosts.map(async ({ node }) => {
        if (languages.indexOf(node.exports.meta.language) === -1) {
          throw new Error(
            `Unrecognized language "${node.exports.meta.language}" for blog post "${node.exports.meta.title}"`,
          )
        }

        const readNextCandidates = blogPosts
          .filter(
            ({ node: n }) =>
              !n.exports.meta.isHidden &&
              n.exports.meta.language === node.exports.meta.language,
          )
          .sort((edgeA, edgeB) => {
            if (!edgeA.node.fields.isSeries || !edgeB.node.fields.isSeries) {
              return 0
            }
            return (
              edgeA.node.exports.meta.seriesPart -
              edgeB.node.exports.meta.seriesPart
            )
          })
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
            seriesId: node.fields.seriesId,
            readNextId: readNext != null ? readNext.node.id : null,
          },
        })

        if (node.fields.isSeries && node.exports.meta.seriesPart === 0) {
          actions.createRedirect({
            fromPath: node.fields.seriesPath,
            toPath: node.fields.path,
            statusCode: 307,
          })
        }
      }),
    )
  }
}
