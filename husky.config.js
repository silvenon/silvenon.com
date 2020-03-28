module.exports = {
  hooks: {
    'pre-commit': 'flow && lint-staged',
    'pre-push': 'yarn install && flow && yarn lint && yarn test',
  },
}
