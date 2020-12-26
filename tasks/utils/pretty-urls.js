const rename = require('gulp-rename')
const lazypipe = require('lazypipe')

const prettyUrls = lazypipe().pipe(rename, ({ dirname, basename }) => {
  if (basename !== 'index') {
    return {
      dirname: `${dirname}/${basename}`,
      basename: 'index',
      extname: '.html',
    }
  }
  return {
    dirname,
    basename,
    extname: '.html',
  }
})

module.exports = prettyUrls
