/* eslint-disable @typescript-eslint/no-unused-vars */
import IndexPage from '../pages/index'
import EmployerUpdatePage from '../pages/employers/employerUpdate'
import EmployerReviewPage from '../pages/employers/employerReview'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('putEmployer')
    cy.task('getEmployer')
    cy.task('getEmployers', { page: 1 })
    cy.signIn()
  })

  it('Validation error display', () => {
    cy.visit('/employers/employer/new/form/add')

    const employerUpdatePage = new EmployerUpdatePage('Employer details')

    employerUpdatePage.submitButton().click()

    employerUpdatePage.employerNamePageErrorMessage().contains('Employer name must be 3 characters or more')

    employerUpdatePage.employerStatusPageErrorMessage().contains('Select an employer status')

    employerUpdatePage.employerSectorPageErrorMessage().contains('Select an employer sector')

    employerUpdatePage.employerDescriptionPageErrorMessage().contains('Enter employer description details')

    employerUpdatePage.employerNameFieldErrorMessage().contains('Employer name must be 3 characters or more')

    employerUpdatePage.employerStatusFieldErrorMessage().contains('Select an employer status')

    employerUpdatePage.employerSectorFieldErrorMessage().contains('Select an employer sector')

    employerUpdatePage.employerDescriptionFieldErrorMessage().contains('Enter employer description details')
  })

  it('Create employer flow', () => {
    cy.visit('/employers/employer/new/form/add')

    const employerUpdatePage = new EmployerUpdatePage('Employer details')
    employerUpdatePage.headerCaption().contains('Add an employer - step 1 of 2')

    employerUpdatePage.employerNameField().type('Test company')
    employerUpdatePage.employerSectorField().select('ADMIN_SUPPORT')
    employerUpdatePage.employerStatusField().select('GOLD')
    employerUpdatePage.employerDescriptionField().type('Test company description')

    employerUpdatePage.submitButton().click()

    const employerReviewPage = new EmployerReviewPage('Check your answers before adding employer')
    employerReviewPage.headerCaption().contains('Add an employer - step 2 of 2')

    employerReviewPage.employerName().contains('Test company')
    employerReviewPage.employerSector().contains('Administration and support services')
    employerReviewPage.employerStatus().contains('Gold')
    employerReviewPage.employerDescription().contains('Test company description')

    employerUpdatePage.submitButton().click()

    cy.task('getBrokerIterationEnabled').then(flagValue => {
      const expectedTitle = flagValue ? 'Manage jobs and employers' : 'Add jobs and employers'
      const indexPage = new IndexPage(expectedTitle)

      // Use indexPage within this block
      indexPage.headerUserName().should('contain.text', 'Expected User')
    })
  })

  it('Create employer - change links flow', () => {
    cy.visit('/employers/employer/new/form/add')

    const employerUpdatePage = new EmployerUpdatePage('Employer details')
    employerUpdatePage.headerCaption().contains('Add an employer - step 1 of 2')

    employerUpdatePage.employerNameField().type('Test company')
    employerUpdatePage.employerSectorField().select('ADMIN_SUPPORT')
    employerUpdatePage.employerStatusField().select('GOLD')
    employerUpdatePage.employerDescriptionField().type('Test company description')

    employerUpdatePage.submitButton().click()

    const employerReviewPage = new EmployerReviewPage('Check your answers before adding employer')
    employerReviewPage.headerCaption().contains('Add an employer - step 2 of 2')

    employerReviewPage.employerName().contains('Test company')
    employerReviewPage.employerSector().contains('Administration and support services')
    employerReviewPage.employerStatus().contains('Gold')
    employerReviewPage.employerDescription().contains('Test company description')

    employerReviewPage.employerNameLink().click()
    employerUpdatePage.employerNameField().type('A different company')
    employerUpdatePage.submitButton().click()
    employerReviewPage.employerName().contains('A different company')

    employerReviewPage.employerSectorLink().click()
    employerUpdatePage.employerSectorField().select('RETAIL')
    employerUpdatePage.submitButton().click()
    employerReviewPage.employerSector().contains('Retail (includes wholesale and motor vehicle repair)')

    employerReviewPage.employerStatusLink().click()
    employerUpdatePage.employerStatusField().select('SILVER')
    employerUpdatePage.submitButton().click()
    employerReviewPage.employerStatus().contains('Silver')

    employerReviewPage.employerDescriptionLink().click()
    employerUpdatePage.employerDescriptionField().type('A different test company description')
    employerUpdatePage.submitButton().click()
    employerReviewPage.employerDescription().contains('A different test company description')
  })

  it('Handle server validation error display', () => {
    // Simulate duplicate employer name
    cy.task('putEmployer', 'DUPLICATE_EMPLOYER')

    cy.visit('/employers/employer/new/form/add')

    const employerUpdatePage = new EmployerUpdatePage('Employer details')
    employerUpdatePage.headerCaption().contains('Add an employer - step 1 of 2')

    employerUpdatePage.employerNameField().type('Test company')
    employerUpdatePage.employerSectorField().select('ADMIN_SUPPORT')
    employerUpdatePage.employerStatusField().select('GOLD')
    employerUpdatePage.employerDescriptionField().type('Test company description')

    employerUpdatePage.submitButton().click()

    const employerReviewPage = new EmployerReviewPage('Check your answers before adding employer')
    employerReviewPage.submitButton().click()

    employerReviewPage.heading().contains('The employer Test company already exists')
  })
})
