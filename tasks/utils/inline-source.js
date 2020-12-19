const cheerio = require('cheerio')
const transform = require('through2').obj
const path = require('path')
const buildScripts = require('./build-scripts')

function gulpInlineSource() {
  return transform(async (file, enc, cb) => {
    if (file.isBuffer() && file.contents.toString().includes('inline')) {
      const $ = cheerio.load(file.contents.toString())
      await Promise.all(
        $('script[inline]')
          .map(async (i, el) => {
            const filename = $(el).attr('src')
            const result = await buildScripts({
              entryPoints: [path.join('scripts', filename)],
              write: false,
            })
            const compiledJs = result.outputFiles[0].text
            $(el).removeAttr('src').removeAttr('inline').html(compiledJs)
          })
          .get(),
      )
      file.contents = Buffer.from($.html())
    }
    cb(null, file)
  })
}

module.exports = gulpInlineSource
