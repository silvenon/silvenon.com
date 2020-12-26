const gulp = require('gulp')
const transform = require('through2').obj

function watchAndReloadModules(glob, task, dependencies = []) {
  gulp.watch(glob, gulp.series(reloadModules, task))
  function reloadModules() {
    return gulp.src([].concat(glob, dependencies)).pipe(
      transform((file, enc, cb) => {
        if (file.isBuffer()) {
          delete require.cache[file.path]
        }
        cb(null, file)
      }),
    )
  }
}

module.exports = {
  watch: watchAndReloadModules,
}
