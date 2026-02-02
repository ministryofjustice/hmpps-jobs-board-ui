/* eslint-disable @typescript-eslint/no-unused-vars */
import IndexPage from '../pages/index'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import AuthManageDetailsPage from '../pages/authManageDetails'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('getEmployers', { page: 1 })
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User name visible in header', () => {
    cy.signIn()
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const indexPage = new IndexPage(expectedTitle);
      indexPage.headerUserName().should('contain.text', 'T. Smith')
    })
  })

  it('User can sign out', () => {
    cy.signIn()
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })
    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const indexPage = new IndexPage(expectedTitle);
      indexPage.signOut().click()
      Page.verifyOnPage(AuthSignInPage)
    })
  })

  it('User can manage their details', () => {
    cy.signIn()
    cy.task('stubAuthManageDetails')
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })
    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const indexPage = new IndexPage(expectedTitle);

      indexPage.manageDetails().get('a').invoke('removeAttr', 'target')
      indexPage.manageDetails().click()
      Page.verifyOnPage(AuthManageDetailsPage)
    })
  })

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })
    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const indexPage = new IndexPage(expectedTitle);
      cy.task('stubVerifyToken', false)

      // can't do a visit here as cypress requires only one domain
      cy.request('/').its('body').should('contain', 'Sign in')
    })
  })

  it('Token verification failure clears user session', () => {
    cy.signIn()
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })
    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const indexPage = new IndexPage(expectedTitle);
      cy.task('stubVerifyToken', false)

      // can't do a visit here as cypress requires only one domain
      cy.request('/').its('body').should('contain', 'Sign in')

      cy.task('stubVerifyToken', true)
      cy.task('stubManageUser', 'icy water')
      cy.signIn()

      indexPage.headerUserName().contains('I. Water')
    })
  })
})
