const PluginError = require('plugin-error')
const htmlMinifier = require('html-minifier')
const transform = require('through2').obj

function gulpHtmlMinifier() {
  return transform((file, enc, cb) => {
    if (file.isBuffer()) {
      try {
        const result = htmlMinifier.minify(file.contents.toString(), {
          minifyCss: true,
          minifyJs: true,
          removeComments: true,
        })
        file.contents = Buffer.from(result)
      } catch (err) {
        cb(new PluginError('gulp-html-minifier', err))
      }
    }
    cb(null, file)
  })
}

module.exports = gulpHtmlMinifier
