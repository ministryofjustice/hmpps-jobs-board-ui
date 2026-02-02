/* eslint-disable @typescript-eslint/no-unused-vars */
import JobListPage from '../pages/jobs/jobList'
import JobRoleUpdatePage from '../pages/jobs/jobRoleUpdate'
import JobReviewPage from '../pages/jobs/jobReview'
import mockFeatureFlags from '../mockApis/featureFlagMock'
import EmployerListPage from '../pages/employers/employerList'

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

  it('Add job flow', () => {
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      cy.wrap(isEnabled).as('nationalJobsEnabled')
    })
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const jobListPage = new JobListPage(expectedTitle);

      jobListPage.addJobButton().click()

      const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
      cy.get('@nationalJobsEnabled').then(isEnabled => {
        if (isEnabled) {
          jobRoleUpdatePage.headerCaption().contains('Add a job - step 1 of 6')
        } else {
          jobRoleUpdatePage.headerCaption().contains('Add a job - step 1 of 5')
        }
      })

      jobRoleUpdatePage.backLink().click()

      jobListPage.heading().contains(expectedTitle)
    })
  })

  it('Update job flow', () => {
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      cy.wrap(isEnabled).as('nationalJobsEnabled')
    })
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const jobListPage = new JobListPage(expectedTitle);

      jobListPage.jobLink(1).click()

      const jobReviewPage = new JobReviewPage('Warehouse operator')
      cy.get('@nationalJobsEnabled').then(isEnabled => {
        if (isEnabled) {
          jobReviewPage.headerCaption().contains('Update a job - step 6 of 6')
        } else {
          jobReviewPage.headerCaption().contains('Update a job - step 5 of 5')
        }
      })
    })
  })

  it('Check pagination', () => {
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const jobListPage = new JobListPage(expectedTitle);

      jobListPage.nextLink().contains('Next')

      jobListPage.paginationResults().contains('Showing 1 to 20 of 40 results')

      cy.task('getJobs', { page: 2 })

      jobListPage.nextLink().click()

      jobListPage.previousLink().contains('Previous')

      jobListPage.paginationResults().contains('Showing 21 to 40 of 40 results')
    })
  })

  it('Filter validation messages', () => {
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const jobListPage = new JobListPage(expectedTitle);

      jobListPage.jobTitleOrEmployerNameFilterField().type('a')

      jobListPage.applyFiltersButton().click()

      jobListPage
        .jobTitleOrEmployerNameFilterPageErrorMessage()
        .contains('Job title or employer name must be 3 characters or more')
    })
  })

  it('No records found messages', () => {
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled
        ? 'Manage jobs and employers'
        : 'Add jobs and employers'

      const jobListPage = new JobListPage(expectedTitle);

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
})

context('Job status column - dependent on broker iteration flag', () => {
  beforeEach(() => {
    // Freeze time to avoid flaky date comparisons (avoids test failures around midnight)
    const now = new Date()
    now.setHours(12, 0, 0, 0)
    cy.clock(now.getTime())

    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('putJob')
    cy.task('getJob')
    cy.task('getEmployers', { page: 1 })
    cy.task('getJobs', { page: 1 })
    cy.signIn()
  })

  it('Displays correct job status (LIVE or CLOSED) based on closingDate and isRollingOpportunity', () => {
    mockFeatureFlags({
      brokerIterationEnabled: true,
    })

    const jobListPage = new JobListPage('Manage jobs and employers')

    cy.visit('/jobs')

    // Check first job status
    jobListPage.jobStatuses().eq(0).contains('CLOSED')

    // Check second job status
    jobListPage.jobStatuses().eq(1).contains('LIVE')

    // Check third job status
    jobListPage.jobStatuses().eq(2).contains('LIVE')
  })

  it('Does NOT display job status column, brokerIterationEnabled = false', () => {
    mockFeatureFlags({
      brokerIterationEnabled: false,
    })

    const jobListPage = new JobListPage('Manage jobs and employers')

    cy.visit('/jobs')

    jobListPage.jobStatusHeader().should('not.exist')
  })
})
