describe('dark mode', () => {
  it('toggle', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'matchMedia')
          .withArgs('(prefers-color-scheme: dark)')
          .returns({
            matches: true,
            addEventListener() {},
          })
      },
    })

    cy.get('html').should('have.class', 'dark')
    cy.findByRole('button', { name: 'Reset to OS' }).should('not.exist')

    cy.findByRole('switch', { name: 'Disable dark mode' }).click()
    cy.get('html').should('not.have.class', 'dark')
    cy.findByRole('button', { name: 'Reset to OS' }).should('exist')
    cy.findByRole('switch', { name: 'Enable dark mode' }).click()
    cy.get('html').should('have.class', 'dark')
    cy.findByRole('button', { name: 'Reset to OS' }).should('exist')
    cy.findByRole('switch', { name: 'Disable dark mode' }).click()
    cy.get('html').should('not.have.class', 'dark')

    cy.reload()
    cy.get('html').should('not.have.class', 'dark')
    cy.findByRole('button', { name: 'Reset to OS' }).should('exist')

    cy.findByRole('button', { name: 'Reset to OS' }).click()
    cy.get('html').should('have.class', 'dark')
    cy.findByRole('button', { name: 'Reset to OS' }).should('not.exist')

    cy.reload()
    cy.get('html').should('have.class', 'dark')
    cy.findByRole('button', { name: 'Reset to OS' }).should('not.exist')
  })
})
