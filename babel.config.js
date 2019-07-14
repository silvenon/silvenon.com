// https://www.gatsbyjs.org/docs/babel/#how-to-use-a-custom-babelrc-file

module.exports = {
  presets: ['babel-preset-gatsby', '@babel/preset-flow'],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    'babel-plugin-date-fns',
    'babel-plugin-polished',
  ],
}
