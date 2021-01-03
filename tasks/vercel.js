const gulp = require('gulp')
const transform = require('through2').obj
const toml = require('toml')
const prettier = require('prettier')
const rename = require('gulp-rename')
const PluginError = require('plugin-error')

module.exports = {
  compileConfig,
}

function compileConfig() {
  return gulp
    .src('vercel.toml')
    .pipe(
      transform(async (file, enc, cb) => {
        if (file.isBuffer()) {
          try {
            const result = prettier.format(
              JSON.stringify(toml.parse(file.contents)),
              {
                parser: 'json',
                ...(await prettier.resolveConfig(process.cwd())),
              },
            )
            file.contents = Buffer.from(result)
          } catch (err) {
            cb(new PluginError('parse', err, { showStack: true }))
          }
        }
        cb(null, file)
      }),
    )
    .pipe(rename({ extname: '.json' }))
    .pipe(gulp.dest('.'))
}
