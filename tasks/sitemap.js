const gulp = require('gulp')
const sitemap = require('gulp-sitemap')
const { destDir, siteUrl } = require('../site.config')

function createSitemap() {
  return gulp
    .src(`${destDir}/**/*.html`)
    .pipe(sitemap({ siteUrl }))
    .pipe(gulp.dest(destDir))
}

module.exports = createSitemap
