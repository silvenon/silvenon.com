describe('smoke test', () => {
  it('site title', () => {
    cy.visit('/')
    cy.findByRole('heading', { name: 'Matija Marohnić' })
  })
})
