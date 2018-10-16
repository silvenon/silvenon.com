// https://www.gatsbyjs.org/docs/babel/#how-to-use-a-custom-babelrc-file

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
        useBuiltIns: 'usage',
        shippedProposals: true,
      },
    ],
    [
      '@babel/preset-react',
      {
        useBuiltIns: true,
        pragma: 'React.createElement',
      },
    ],
    '@babel/preset-flow',
  ],
  plugins: [
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-macros',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
    process.env.NODE_ENV === 'test'
      ? [
          'astroturf/plugin',
          {
            writeFile: false,
          },
        ]
      : null,
  ],
}
