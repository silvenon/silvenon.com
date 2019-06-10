const range = require('./range')

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

module.exports = paginate
