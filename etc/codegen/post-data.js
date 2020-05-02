const { getPostFilePathsSync, getAllPostDataSync } = require('../get-post-data')

const codegenPostData = () => {
  const posts = getAllPostDataSync(getPostFilePathsSync()).map(
    // filter out file path, we don't need this in frontend
    ({ filePath, ...post }) => post,
  )

  return `posts = ${JSON.stringify(posts, null, 2)}`
}

module.exports = codegenPostData
