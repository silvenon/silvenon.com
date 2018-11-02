/* eslint-disable global-require, import/no-dynamic-require */
module.exports = ctx => ({
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-preset-env')({
      stage: 0,
      preserve: ctx.file.basename === 'index.css',
      importFrom: './src/styles/imports.js',
      features: {
        'nesting-rules': false, // in favor of postcss-nested
      },
    }),
    require('postcss-color-function'),
    require('postcss-webfontloader')({
      modules: true,
      families: ['Lora'],
    }),
  ],
})
