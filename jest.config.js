const { defaults } = require('jest-config')

module.exports = {
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    '<rootDir>/.cache/',
  ],
  watchPathIgnorePatterns: [
    ...defaults.watchPathIgnorePatterns,
    '<rootDir>/.cache/',
    '<rootDir>/public/',
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
}
