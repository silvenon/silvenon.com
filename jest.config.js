const { defaults } = require('jest-config')

module.exports = {
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    '<rootDir>/.cache/',
  ],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/style-mock.js',
  },
}
