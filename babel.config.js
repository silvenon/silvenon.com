module.exports = {
  presets: ['next/babel'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    'babel-plugin-date-fns',
    'babel-plugin-polished',
    'babel-plugin-lodash',
    ['babel-plugin-styled-components', { ssr: true }],
    'babel-plugin-macros',
  ],
}
