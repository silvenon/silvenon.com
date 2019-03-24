/* eslint-disable global-require */
module.exports = {
  parser: 'postcss-scss',
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-preset-env')({
      stage: 0,
      importFrom: './src/styles/globals.module.css',
      features: {
        'nesting-rules': false, // in favor of postcss-nested
        'color-mod-function': true,
      },
    }),
    require('postcss-webfontloader')({
      modules: true,
      families: ['Lora'],
    }),
  ],
}
