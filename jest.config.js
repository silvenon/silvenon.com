const tsJestPreset = require('ts-jest/utils').createJestPreset()

/** @typedef {import('ts-jest/dist/types')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  projects: [
    {
      displayName: 'client',
      testMatch: ['<rootDir>/scripts/**/__tests__/*.test.ts?(x)'],
      preset: 'ts-jest',
      transform: {
        ...tsJestPreset.transform,
        // @gitgraph/js is published as ESM instead of CJS
        '/node_modules/@gitgraph/js/lib/.*\\.js$': [
          'babel-jest',
          {
            plugins: ['@babel/plugin-transform-modules-commonjs'],
          },
        ],
      },
      transformIgnorePatterns: ['/node_modules/(?!@gitgraph/js/lib/)'],
      setupFilesAfterEnv: ['@testing-library/jest-dom'],
    },
    {
      displayName: 'build',
      testMatch: ['<rootDir>/{tasks,views}/**/__tests__/*.test.js'],
      setupFiles: ['./test/setup'],
    },
  ],
}
