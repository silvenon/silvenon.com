const path = require('path')
const { pascalCase } = require('change-case')
const { compareDesc } = require('date-fns')
const {
  getPostPathName,
  getPostFilePathsSync,
  getPostFrontmatterSync,
} = require('../get-post-data')
const { POSTS_DIR } = require('../consts')

const codegenPostImports = ({
  fromDir,
  limit = Infinity,
  noSequels = false,
} = {}) => {
  const posts = getPostFilePathsSync()
    .map((post) => {
      const { seriesPart, published } = getPostFrontmatterSync(post)
      const slug = getPostPathName(post)
        .replace('/blog/', '')
        .replace(/index\.mdx$/, '')
        .split('/')
      const importName = pascalCase(slug.join(' '))
      const relativePath = path.relative(
        `${process.cwd()}/${fromDir}`,
        `${POSTS_DIR}/${slug.join('/')}`,
      )

      return {
        seriesPart,
        published,
        importName,
        importSource: relativePath.startsWith('../')
          ? `${relativePath}.mdx`
          : `./${relativePath}.mdx`,
      }
    })
    .filter(
      ({ seriesPart }) =>
        !noSequels || typeof seriesPart === 'undefined' || seriesPart === 0,
    )
    .sort((postA, postB) =>
      compareDesc(new Date(postA.published), new Date(postB.published)),
    )
    .slice(0, limit)

  const importStatements = posts
    .map(
      ({ importName, importSource }) =>
        `import * as ${importName} from '${importSource}'`,
    )
    .join('\n')

  const variableDeclaration = `posts = [\n  ${posts
    .map(({ importName }) => importName)
    .join(',\n  ')}\n]`

  return `${importStatements}\n\n${variableDeclaration}`
}

module.exports = codegenPostImports
