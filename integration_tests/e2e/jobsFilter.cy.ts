// integration_tests/e2e/jobsFilter.cy.ts
import JobListPage from '../pages/jobs/jobList'

context('Feature flag enabled', () => {
  beforeEach(() => {
    Cypress.env('FILTER_JOBS_CREATED_BY_ME_ENABLED', true)
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('getJob')
    cy.task('getEmployers', { page: 1 })
    cy.task('getJobs', { page: 1 })
    cy.signIn()
    cy.visit('/jobs')
  })

  it('Should display the "Show only my jobs" checkbox', () => {
    const jobListPage = new JobListPage('Add jobs and employers')

    jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').should('exist')
    jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').should('not.be.checked')
  })

  it('Should toggle the checkbox on and off', () => {
    const jobListPage = new JobListPage('Add jobs and employers')

    jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').check().should('be.checked')
    jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').uncheck().should('not.be.checked')
  })

  it('Should include myOwnJobsFilter in the query when checked', () => {
    const jobListPage = new JobListPage('Add jobs and employers')

    cy.intercept('GET', '/jobs*').as('getJobs')
    jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').check()
    jobListPage.applyFiltersButton().click()
    cy.wait('@getJobs').its('request.url').should('include', 'myOwnJobsFilter=true')
  })

  it('Should not include myOwnJobsFilter in the query when unchecked', () => {
    const jobListPage = new JobListPage('Add jobs and employers')

    cy.intercept('GET', '/jobs*').as('getJobs')
    jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').uncheck()
    jobListPage.applyFiltersButton().click()
    cy.wait('@getJobs').its('request.url').should('not.include', 'myOwnJobsFilter=true')
  })
})

context('Feature flag disabled', () => {
  beforeEach(() => {
    Cypress.env('FILTER_JOBS_CREATED_BY_ME_ENABLED', false)
    cy.visit('/jobs')
  })

  it('Should not display the "Show only my jobs" checkbox', () => {
    cy.get('#myOwnJobsFilter').should('not.exist')
    cy.contains('Show only my jobs').should('not.exist')
  })
})
