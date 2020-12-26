const gulp = require('gulp')
const del = require('del')
// environment variables have to be loaded before requiring cloudinary
// because just requiring cloudinary already configures it
require('dotenv-safe').config()
const cloudinary = require('cloudinary').v2
const views = require('./tasks/views')
const styles = require('./tasks/styles')
const scripts = require('./tasks/scripts')
const templates = require('./tasks/templates')
const server = require('./tasks/server')
const staticAssets = require('./tasks/static')
const createFeed = require('./tasks/feed')
const createSitemap = require('./tasks/sitemap')
const { destDir } = require('./site.config')

cloudinary.config({ secure: true }) // use https

async function clean() {
  await del(destDir)
}

const dev = gulp.series(
  clean,
  views.compile, // needs to run before scripts to collect data
  gulp.parallel(
    styles.compile,
    scripts.compile,
    templates.compile,
    staticAssets.copy,
  ),
  gulp.parallel(
    views.watch,
    styles.watch,
    scripts.watch,
    templates.watch,
    staticAssets.watch,
    server.init,
  ),
)

const build = gulp.series(
  clean,
  views.compile,
  gulp.parallel(
    scripts.compile,
    staticAssets.copy,
    templates.compile,
    createFeed,
    createSitemap,
  ),
  styles.compile, // purging based on compiled HTML
  views.revRewrite,
)

module.exports = {
  dev,
  build,
  generate: gulp.parallel(scripts.generate),
}
