import JobListPage from '../pages/jobs/jobList'
import mockFeatureFlags from '../mockApis/featureFlagMock'

context('Feature flag enabled', () => {
  beforeEach(() => {
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
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled ? 'Manage jobs and employers' : 'Add jobs and employers'

      const jobListPage = new JobListPage(expectedTitle)

      jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').should('exist')
      jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').should('not.be.checked')
    })
  })

  it('Should toggle the checkbox on and off', () => {
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled ? 'Manage jobs and employers' : 'Add jobs and employers'

      const jobListPage = new JobListPage(expectedTitle)

      jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').check().should('be.checked')
      jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').uncheck().should('not.be.checked')
    })
  })

  it('Should include myOwnJobsFilter in the query when checked', () => {
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled ? 'Manage jobs and employers' : 'Add jobs and employers'

      const jobListPage = new JobListPage(expectedTitle)

      cy.intercept('GET', '/jobs*').as('getJobs')
      jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').check()
      jobListPage.applyFiltersButton().click()
      cy.wait('@getJobs').its('request.url').should('include', 'myOwnJobsFilter=true')
    })
  })

  it('Should not include myOwnJobsFilter in the query when unchecked', () => {
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      cy.wrap(isEnabled).as('brokerIterationEnabled')
    })

    cy.get('@brokerIterationEnabled').then(brokerIterationEnabled => {
      const expectedTitle = brokerIterationEnabled ? 'Manage jobs and employers' : 'Add jobs and employers'

      const jobListPage = new JobListPage(expectedTitle)

      cy.intercept('GET', '/jobs*').as('getJobs')
      jobListPage.myOwnJobsFilterCheckBox('SHOW_ONLY_MY_JOBS').uncheck()
      jobListPage.applyFiltersButton().click()
      cy.wait('@getJobs').its('request.url').should('not.include', 'myOwnJobsFilter=true')
    })
  })
})

context('Feature flag disabled', () => {
  beforeEach(() => {
    mockFeatureFlags({
      brokerIterationEnabled: false,
    })
    cy.visit('/jobs')
  })

  it('Should not display the "Show only my jobs" checkbox', () => {
    cy.get('#myOwnJobsFilter').should('not.exist')
    cy.contains('Show only my jobs').should('not.exist')
  })
})
