context('Healthcheck', () => {
  context('All healthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubTokenVerificationPing')
      cy.task('stubNomisUserRolesClientPing')
      cy.task('stubManageUsersPing')
      cy.task('stubFrontendComponentsPing')
      cy.task('stubJobApiPing')
    })

    it('Health check page is visible', () => {
      cy.request('/health').its('body.status').should('equal', 'UP')
    })

    it('Ping is visible and UP', () => {
      cy.request('/ping').its('body.status').should('equal', 'UP')
    })

    it('Info is visible and UP', () => {
      cy.request('/info').its('body.build.artifact').should('equal', 'hmpps-jobs-board-ui')
    })

    it('Failed test for status-check', () => {
      throw new Error('test fails here')
    })
  })

  context('Some unhealthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubTokenVerificationPing', 500)
      cy.task('stubNomisUserRolesClientPing')
      cy.task('stubManageUsersPing')
      cy.task('stubFrontendComponentsPing')
      cy.task('stubJobApiPing')
    })

    it('Reports correctly when token verification down', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).then(response => {
        expect(response.body.components.hmppsAuth.status).to.equal('UP')
        expect(response.body.components.tokenVerification.status).to.equal('DOWN')
        expect(response.body.components.tokenVerification.details).to.contain({ status: 500, attempts: 3 })
      })
    })

    it('Health check page is visible and DOWN', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).its('body.status').should('equal', 'DOWN')
    })
  })
})
