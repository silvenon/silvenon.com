module.exports = ctx => ({
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-preset-env': {
      stage: 0,
      preserve: ctx.file.basename === 'index.css',
      importFrom: './src/styles/imports.js',
      features: {
        'nesting-rules': false, // in favor of postcss-nested
      },
    },
    'postcss-color-function': {},
  },
})
