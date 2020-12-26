const gulp = require('gulp')
const postcss = require('postcss')
const postcssrc = require('postcss-load-config')
const fsx = require('fs-extra')
const rev = require('./utils/revision')
const { isProd, destDir } = require('../site.config')

const { plugins, options } = postcssrc.sync()
const processor = postcss(plugins)

const from = 'styles/main.css'
const to = `${destDir}/style.css`

async function compileStyles() {
  const css = await fsx.readFile(from)
  const result = await processor.process(css, { ...options, from, to })
  const destPath = isProd ? rev.path(to, result.css) : to
  await fsx.outputFile(destPath, result.css)
}

function watchStyles() {
  gulp.watch(['styles/*.css', 'tailwind.config.js'], compileStyles)
}

module.exports = {
  compile: compileStyles,
  watch: watchStyles,
}
