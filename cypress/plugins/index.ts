module.exports = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) => {
  const port = process.env.PORT ?? '3000'
  const configOverrides: Partial<Cypress.PluginConfigOptions> = {
    baseUrl: `http://localhost:${port}`,
    integrationFolder: 'cypress/e2e',
    video: !process.env.CI,
    screenshotOnRunFailure: !process.env.CI,
  }
  Object.assign(config, configOverrides)

  // To use this:
  // cy.task('log', whateverYouWantInTheTerminal)
  on('task', {
    log(message: string) {
      console.log(message)
      return null
    },
  })

  return config
}
