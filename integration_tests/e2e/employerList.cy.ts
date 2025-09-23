/* eslint-disable @typescript-eslint/no-unused-vars */
import EmployerUpdatePage from '../pages/employers/employerUpdate'
import EmployerReviewPage from '../pages/employers/employerReview'
import EmployerListPage from '../pages/employers/employerList'

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

  it('Add employer flow', () => {
    const employerListPage = new EmployerListPage('Manage jobs and employers')

    employerListPage.addEmployerButton().click()

    const employerUpdatePage = new EmployerUpdatePage('Employer details')
    employerUpdatePage.headerCaption().contains('Add an employer - step 1 of 2')

    employerUpdatePage.backLink().click()

    employerListPage.heading().contains('Manage jobs and employers')
  })

  it('Update employer flow', () => {
    const employerListPage = new EmployerListPage('Manage jobs and employers')

    employerListPage.employerLink(1).click()

    const employerUpdatePage = new EmployerReviewPage('ASDA')
    employerUpdatePage.headerCaption().contains('Update an employer - step 2 of 2')
  })

  it('Check pagination', () => {
    const employerListPage = new EmployerListPage('Manage jobs and employers')

    employerListPage.nextLink().contains('Next')

    employerListPage.paginationResults().contains('Showing 1 to 20 of 39 results')

    cy.task('getEmployers', { page: 2 })

    employerListPage.nextLink().click()

    employerListPage.previousLink().contains('Previous')

    employerListPage.paginationResults().contains('Showing 21 to 39 of 39 results')
  })

  it('Filter validation messages', () => {
    const employerListPage = new EmployerListPage('Manage jobs and employers')

    employerListPage.employerNameFilterField().type('a')

    employerListPage.applyFiltersButton().click()

    employerListPage.employerNameFilterPageErrorMessage().contains('Employer name must be 2 characters or more')
  })

  it('No records found messages', () => {
    const employerListPage = new EmployerListPage('Manage jobs and employers')

    employerListPage.employerNameFilterField().type('adsds')

    cy.task('getEmployers', { page: 1, employerNameFilter: 'adsds' })

    employerListPage.applyFiltersButton().click()

    employerListPage.noResultsMessage().contains(`0 results for "adsds" in employers's name`)

    employerListPage.clearFiltersLink().click()

    employerListPage.employerNameFilterField().type('adsds')

    employerListPage.employerSectorFilterField().select('RETAIL')

    employerListPage.applyFiltersButton().click()

    employerListPage
      .noResultsMessage()
      .contains(`0 results for "adsds" in Retail (includes wholesale and motor vehicle repair)`)

    employerListPage.clearFiltersLink().click()

    employerListPage.employerSectorFilterField().select('RETAIL')

    employerListPage.applyFiltersButton().click()

    employerListPage.noResultsMessage().contains(`0 results in Retail (includes wholesale and motor vehicle repair)`)
  })
})
