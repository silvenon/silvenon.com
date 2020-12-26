const gulp = require('gulp')
const buildScripts = require('./utils/build-scripts')
const rev = require('./utils/revision')
const { collectData, collectedData } = require('./collections')
const { theme } = require('./utils/full-tailwind-config')
const fsx = require('fs-extra')
const { ESLint } = require('eslint')
const { proseClassName } = require('./utils/consts')
const { isProd, destDir } = require('../site.config')
const path = require('path')

const eslint = new ESLint({ fix: true })

async function generateConstants() {
  const postData = collectedData.posts
    .filter((post) => !post.draft)
    .map((post) => ({
      title: post.seriesTitle
        ? `${post.seriesTitle}: ${post.title}`
        : post.title,
      relativeUrl: post.relativeUrl,
      slug: post.slug,
    }))
  const filePath = 'scripts/consts.ts'
  const results = await eslint.lintText(
    `
/**
 * Automatically generated in ${path.relative(process.cwd(), __filename)}.
 */

export const proseClassName = ${JSON.stringify(proseClassName)}
export const screens = ${JSON.stringify(theme.screens, null, 2)}
export const colors = ${JSON.stringify(theme.colors, null, 2)}
export const posts = ${JSON.stringify(postData, null, 2)}
    `.trim(),
    // needed for resolving ESLint configuration
    { filePath },
  )
  const { errorCount, source, output } = results[0]
  if (errorCount > 0) {
    const formatter = await eslint.loadFormatter()
    throw new Error(`${formatter.format(results)}\nSource:\n\n${source}`)
  } else {
    await fsx.outputFile(filePath, output)
  }
}

async function compileScripts() {
  await buildScripts({
    entryPoints: [
      'scripts/search.tsx',
      'scripts/gitgraph-init.ts',
      'scripts/post.ts',
    ],
    sourcemap: !isProd,
  })
}

function watchScripts() {
  gulp.watch('scripts/*.ts?(x)', compileScripts)
}

function revisionScripts() {
  return gulp.src(`${destDir}/*.js`).pipe(rev.rename()).pipe(gulp.dest(destDir))
}

module.exports = {
  compile: isProd
    ? gulp.series(generateConstants, compileScripts, revisionScripts)
    : gulp.series(generateConstants, compileScripts),
  watch: watchScripts,
  generate: gulp.series(collectData, generateConstants),
}
