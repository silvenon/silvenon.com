/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path')
const { range } = require('lodash')

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin(
    {
      name: 'babel-plugin-date-fns',
    },
    {
      name: 'babel-plugin-polished',
    },
  )
}

const isCssModulesRule = ({ test }) => test.source.includes('\\.module\\.css')
const isCssRules = ({ oneOf }) =>
  Array.isArray(oneOf) && oneOf.some(isCssModulesRule)
const isStyleLoader = ({ loader }) => /\bstyle-loader\b/.test(loader)

exports.onCreateWebpackConfig = ({ getConfig, stage, actions }) => {
  if (stage === 'develop') {
    const config = getConfig()
    const cssModulesRule = config.module.rules
      .find(isCssRules)
      .oneOf.find(isCssModulesRule)
    const cssModulesFlowTypesLoader = {
      loader: 'css-modules-flow-types-loader',
      options: {},
    }
    cssModulesRule.use.splice(
      cssModulesRule.use.findIndex(isStyleLoader) + 1,
      0,
      cssModulesFlowTypesLoader,
    )
    actions.replaceWebpackConfig(config)
  }

  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /webfontloader/,
            loader: 'null-loader',
          },
        ],
      },
    })
  }
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'Mdx') {
    const fileNode = getNode(node.parent)
    const isDraft = fileNode.sourceInstanceName === 'drafts'
    const [date, slug] = isDraft
      ? [fileNode.modifiedTime, fileNode.name]
      : fileNode.name.split('_')
    if (/^\d+-\d+-\d+/.test(slug)) {
      throw new Error(`Invalid file name format: "${fileNode.name}"`)
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

const paginate = ({
  createPage,
  basePath,
  component,
  items,
  perPage,
  context,
}) => {
  const pages = range(Math.ceil(items.length / perPage))
  const getPagePath = page =>
    page === 0 ? basePath : `${basePath}/page/${page + 1}`
  pages.forEach(page => {
    const currentPagePath = getPagePath(page)
    const previousPagePath = page > 0 ? getPagePath(page - 1) : null
    const nextPagePath = page < pages.length - 1 ? getPagePath(page + 1) : null

    createPage({
      path: currentPagePath,
      component,
      context: {
        ...context,
        limit: perPage,
        skip: perPage * page,
        pageNumber: page,
        numberOfPages: pages.length,
        previousPagePath,
        nextPagePath,
      },
    })
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMdx {
        edges {
          node {
            parent {
              ... on File {
                absolutePath
              }
            }
            fields {
              date
              path
              slug
              isDraft
            }
            exports {
              meta {
                title
                lang
                category
                lastModified
              }
            }
            excerpt
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
    const categories = ['DEV', 'NON_DEV']
    const categorySlug = {
      DEV: 'dev',
      NON_DEV: 'non-dev',
    }
    const perPage = 7

    paginate({
      createPage,
      basePath: `/blog`,
      component: blogTemplate,
      items: blogPosts,
      perPage,
    })

    categories.forEach(category => {
      paginate({
        createPage,
        basePath: `/blog/category/${categorySlug[category]}`,
        component: blogTemplate,
        items: blogPosts.filter(
          ({ node }) => node.exports.meta.category === category,
        ),
        perPage,
        context: { category },
      })
    })

    blogPosts.forEach(({ node }, index) => {
      const readNextSuggestions = blogPosts.filter(
        ({ node: n }, i) =>
          n.exports.meta.category === node.exports.meta.category && i !== index,
      )
      createPage({
        path: node.fields.path,
        component: node.parent.absolutePath,
        context: {
          node,
          readNextSuggestions: readNextSuggestions.map(({ node }) => ({
            title: node.exports.meta.title,
            path: node.fields.path,
          })),
        },
      })
    })
  }
}
