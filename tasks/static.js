const gulp = require('gulp')
const gulpIf = require('gulp-if')
const server = require('./server')
const rev = require('./utils/revision')
const { isProd, destDir } = require('../site.config')

function copyStatic() {
  return gulp
    .src('static/**/*')
    .pipe(gulpIf(isProd, rev.rename()))
    .pipe(gulp.dest(destDir))
    .pipe(server.stream())
}

function watchStatic() {
  gulp.watch('static/**/*', copyStatic)
}

module.exports = {
  copy: copyStatic,
  watch: watchStatic,
}
