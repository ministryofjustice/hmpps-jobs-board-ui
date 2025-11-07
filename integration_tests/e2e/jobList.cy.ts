/* eslint-disable @typescript-eslint/no-unused-vars */
import JobListPage from '../pages/jobs/jobList'
import JobRoleUpdatePage from '../pages/jobs/jobRoleUpdate'
import JobReviewPage from '../pages/jobs/jobReview'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('putJob')
    cy.task('getJob')
    cy.task('getEmployers', { page: 1 })
    cy.task('getJobs', { page: 1 })
    cy.signIn()
    cy.visit('/jobs')
  })

  it('Add employer flow', () => {
    const jobListPage = new JobListPage('Manage jobs and employers')

    jobListPage.addJobButton().click()

    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
    jobRoleUpdatePage.headerCaption().contains('Add a job - step 1 of 5')

    jobRoleUpdatePage.backLink().click()

    jobListPage.heading().contains('Manage jobs and employers')
  })

  it('Update employer flow', () => {
    const jobListPage = new JobListPage('Manage jobs and employers')

    jobListPage.jobLink(1).click()

    const jobReviewPage = new JobReviewPage('Warehouse operator')
    jobReviewPage.headerCaption().contains('Update a job - step 5 of 5')
  })

  it('Check pagination', () => {
    const jobListPage = new JobListPage('Manage jobs and employers')

    jobListPage.nextLink().contains('Next')

    jobListPage.paginationResults().contains('Showing 1 to 20 of 39 results')

    cy.task('getJobs', { page: 2 })

    jobListPage.nextLink().click()

    jobListPage.previousLink().contains('Previous')

    jobListPage.paginationResults().contains('Showing 21 to 39 of 39 results')
  })

  it('Filter validation messages', () => {
    const jobListPage = new JobListPage('Manage jobs and employers')

    jobListPage.jobTitleOrEmployerNameFilterField().type('a')

    jobListPage.applyFiltersButton().click()

    jobListPage
      .jobTitleOrEmployerNameFilterPageErrorMessage()
      .contains('Job title or employer name must be 3 characters or more')
  })

  it('No records found messages', () => {
    const jobListPage = new JobListPage('Manage jobs and employers')

    jobListPage.jobTitleOrEmployerNameFilterField().type('adsds')

    jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').uncheck({ force: true })
    cy.task('getJobs', { page: 1, jobTitleOrEmployerNameFilter: 'adsds', myOwnJobsFilter: false })

    jobListPage.applyFiltersButton().click()

    jobListPage.noResultsMessage().contains(`0 results for "adsds" in job title or employer name`)

    jobListPage.clearFiltersLink().click()

    jobListPage.jobTitleOrEmployerNameFilterField().type('adsds')

    jobListPage.jobSectorFilterField().select('RETAIL')

    jobListPage.applyFiltersButton().click()

    jobListPage.noResultsMessage().contains(`0 results for "adsds" in Retail and sales`)

    jobListPage.clearFiltersLink().click()

    jobListPage.jobSectorFilterField().select('RETAIL')

    jobListPage.applyFiltersButton().click()

    jobListPage.noResultsMessage().contains(`0 results in Retail and sales`)
  })
})
