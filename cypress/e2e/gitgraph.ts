describe('Gitgraph', () => {
  it('renders graph of commits', () => {
    cy.visit('/blog/better-git-history/rebasing')
    cy.findAllByTestId('gitgraph')
      .first()
      .within(() => {
        cy.get('svg').should('exist')
      })
  })
})
