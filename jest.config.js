const { defaults } = require('jest-config')

module.exports = {
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    '<rootDir>/.cache/',
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
}
