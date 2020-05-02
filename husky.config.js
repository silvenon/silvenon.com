module.exports = {
  hooks: {
    'pre-commit': 'tsc && lint-staged',
    'pre-push': 'yarn install && tsc && yarn lint && yarn test',
  },
}
