const { isProd } = require('./site.config')

module.exports = {
  syntax: 'postcss-scss', // literally only to add support for line comments
  map: !isProd,
  plugins: [
    require('postcss-import'),
    require('postcss-strip-inline-comments'),
    require('tailwindcss'),
    require('postcss-nested'),
    ...(isProd ? [require('autoprefixer'), require('cssnano')] : []),
  ],
}
