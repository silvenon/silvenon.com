const jestConfig = require('jest-config')
const tsJestPreset = require('ts-jest/utils').createJestPreset()

// these modules are published as ESM, and need to be transpiled to CJS
const esModules = ['@gitgraph/js', '@iconify-icons'].join('|')

module.exports = {
  testMatch: jestConfig.defaults.testMatch,
  preset: 'ts-jest',
  transform: {
    ...tsJestPreset.transform,
    [`/node_modules/(${esModules})/`]: [
      'babel-jest',
      {
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
    ],
  },
  transformIgnorePatterns: [`/node_modules/(?!(${esModules})/)`],
  setupFilesAfterEnv: ['./test/jest-setup.ts'],
}
