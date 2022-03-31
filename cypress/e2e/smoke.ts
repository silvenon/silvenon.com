describe('smoke test', () => {
  it('search', () => {
    cy.visit('/')
    cy.findByRole('button', { name: 'Search' }).click()
    cy.findByRole('combobox')
  })
})
