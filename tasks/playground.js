const gulp = require('gulp')
const data = require('gulp-data')
const faker = require('faker')
const eta = require('./utils/gulp-eta')
const prettyUrls = require('./utils/pretty-urls')
const { theme } = require('./utils/full-tailwind-config')
const { destDir } = require('../site.config')

function compilePlayground() {
  return gulp
    .src('views/playground.eta', { allowEmpty: true })
    .pipe(eta.compile())
}

function renderPlayground() {
  return gulp
    .src('views/playground.eta', { allowEmpty: true })
    .pipe(data({ lorem: faker.lorem, colors: theme.colors }))
    .pipe(eta.render())
    .pipe(eta.layout('layouts/bare.eta'))
    .pipe(prettyUrls())
    .pipe(gulp.dest(destDir))
}

function watchPlayground() {
  gulp.watch(
    ['views/playground.eta', 'layouts/bare.eta'],
    gulp.series(compilePlayground, renderPlayground),
  )
}

module.exports = {
  compile: gulp.series(compilePlayground, renderPlayground),
  watch: watchPlayground,
}
