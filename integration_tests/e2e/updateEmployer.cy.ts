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

  it('Update employer flow', () => {
    cy.visit('/employers/employer/01907e1e-bb85-7bb7-9018-33a2070a367d')

    const employerReviewPage = new EmployerReviewPage('ASDA')
    employerReviewPage.headerCaption().contains('Update an employer - step 2 of 2')

    employerReviewPage.employerName().contains('ASDA')
    employerReviewPage.employerSector().contains('Arts and entertainment')
    employerReviewPage.employerStatus().contains('Gold')
    employerReviewPage.employerDescription().contains('Some employer information and bio')

    employerReviewPage.submitButton().click()

    const indexPage = new IndexPage('Add jobs and employers')
  })

  it('Update employer - change links flow', () => {
    cy.visit('/employers/employer/01907e1e-bb85-7bb7-9018-33a2070a367d')

    const employerReviewPage = new EmployerReviewPage('ASDA')
    employerReviewPage.headerCaption().contains('Update an employer - step 2 of 2')

    employerReviewPage.employerNameLink().click()

    const employerUpdatePage = new EmployerUpdatePage('Employer details')
    employerUpdatePage.headerCaption().contains('Update an employer - step 1 of 2')

    employerUpdatePage.employerNameField().clear().type('A different company')
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
    employerUpdatePage.employerDescriptionField().clear().type('A different test company description')
    employerUpdatePage.submitButton().click()
    employerReviewPage.employerDescription().contains('A different test company description')
  })
})
