const gulp = require('gulp')
const data = require('gulp-data')
const eta = require('./utils/gulp-eta')
const rename = require('gulp-rename')
const server = require('./server')
const { theme } = require('./utils/full-tailwind-config')
const { destDir } = require('../site.config')

function compileTemplates() {
  return gulp
    .src(['templates/**/*.eta', '!templates/partials/**'])
    .pipe(
      data({
        colors: theme.colors,
      }),
    )
    .pipe(
      eta.render({
        views: `${process.cwd()}/templates`,
        cache: false,
      }),
    )
    .pipe(
      rename((path) => {
        path.extname = ''
      }),
    )
    .pipe(gulp.dest(destDir))
    .pipe(server.stream({ once: true }))
}

function watchTemplates() {
  gulp.watch('templates/**/*.eta', compileTemplates)
}

module.exports = {
  compile: compileTemplates,
  watch: watchTemplates,
}
