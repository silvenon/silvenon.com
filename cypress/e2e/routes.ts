describe('routes', () => {
  it('blog post', () => {
    cy.visit('/blog/intro-to-eslint')
    cy.findByRole('heading', { name: /Intro to ESLint/ })
  })

  it('not found', () => {
    cy.visit('/blog', { failOnStatusCode: false })
    cy.findByRole('heading', { name: 'Page Not Found' })
    cy.visit('/blog/non-existent-post', { failOnStatusCode: false })
    cy.findByRole('heading', { name: 'Post Not Found' })
  })

  it('redirects', () => {
    cy.visit('/intro-to-eslint')
    cy.location().its('pathname').should('eq', '/blog/intro-to-eslint')
    cy.visit('/blog/better-git-history')
    cy.location()
      .its('pathname')
      .should('eq', '/blog/better-git-history/introduction')
  })
})
