/* eslint-disable global-require, import/no-dynamic-require */
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-preset-env')({
      stage: 0,
      importFrom: './src/styles/globals.css',
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
