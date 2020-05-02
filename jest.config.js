const { defaults } = require('jest-config')

const nextDirs = ['<rootDir>/.next/', '<rootDir>/out/']

module.exports = {
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    '/__fixtures__/',
  ],
  watchPathIgnorePatterns: [...defaults.watchPathIgnorePatterns, ...nextDirs],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
}
