/* eslint-disable @typescript-eslint/no-unused-vars */
import IndexPage from '../pages/index'
import EmployerUpdatePage from '../pages/employers/employerUpdate'
import EmployerReviewPage from '../pages/employers/employerReview'
import JobRoleUpdatePage from '../pages/jobs/jobRoleUpdate'
import JobContractUpdatePage from '../pages/jobs/jobContractUpdate'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('getEmployers', { page: 1 })
    cy.signIn()
  })

  it('Validation error display', () => {
    cy.visit('/jobs/job/new/role')

    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')

    jobRoleUpdatePage.submitButton().click()

    // Page errors
    jobRoleUpdatePage.employerIdPageErrorMessage().contains("Select employer or select 'Add an employer'")
    jobRoleUpdatePage.jobTitlePageErrorMessage().contains('Job title must be 3 characters or more')
    jobRoleUpdatePage.jobSectorPageErrorMessage().contains('Select a job sector')
    jobRoleUpdatePage.industrySectorPageErrorMessage().contains('Select an NFN industry sector')
    jobRoleUpdatePage.numberOfVacanciesPageErrorMessage().contains('Enter number of vacancies')
    jobRoleUpdatePage.jobSourcePageErrorMessage().contains('Select a job source')

    // Field errors
    jobRoleUpdatePage.employerIdFieldErrorMessage().contains("Select employer or select 'Add an employer'")
    jobRoleUpdatePage.jobTitleFieldErrorMessage().contains('Job title must be 3 characters or more')
    jobRoleUpdatePage.jobSectorFieldErrorMessage().contains('Select a job sector')
    jobRoleUpdatePage.industrySectorFieldErrorMessage().contains('Select an NFN industry sector')
    jobRoleUpdatePage.numberOfVacanciesFieldErrorMessage().contains('Enter number of vacancies')
    jobRoleUpdatePage.jobSourceFieldErrorMessage().contains('Select a job source')

    // Move to next page
    jobRoleUpdatePage.employerIdField().type('ASDA')
    jobRoleUpdatePage.employerIdFieldOption(0).click()
    jobRoleUpdatePage.jobTitleField().type('Test job')
    jobRoleUpdatePage.jobSectorField().select('OFFICE')
    jobRoleUpdatePage.industrySectorField().select('ADMIN_SUPPORT')
    jobRoleUpdatePage.numberOfVacanciesField().type('1')
    jobRoleUpdatePage.jobSourceField().select('NFN')
    jobRoleUpdatePage.jobSource2Field().select('PEL')
    jobRoleUpdatePage.charityField().type('Test charity')

    jobRoleUpdatePage.submitButton().click()

    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')

    jobContractUpdatePage.submitButton().click()

    jobContractUpdatePage.postcodePageErrorMessage().contains('Enter a job location')
    jobContractUpdatePage.salaryFromPageErrorMessage().contains('Enter minimum salary amount')
    jobContractUpdatePage.salaryPeriodPageErrorMessage().contains('Select a salary period')
    jobContractUpdatePage
      .nationalMinimumWagePageErrorMessage()
      .contains('Select whether the job pays minimum wage or not')
    jobContractUpdatePage.workPatternPageErrorMessage().contains('Select a work pattern')
    jobContractUpdatePage.contractTypePageErrorMessage().contains('Select a contract type')
    jobContractUpdatePage.hoursPageErrorMessage().contains('Select the hours for this job')
  })

  it('Create job flow', () => {
    cy.visit('/jobs/job/new/role')

    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
    jobRoleUpdatePage.headerCaption().contains('Add a job - step 1 of 5')

    jobRoleUpdatePage.employerIdField().type('ASDA')
    jobRoleUpdatePage.employerIdFieldOption(0).click()
    jobRoleUpdatePage.jobTitleField().type('Test job')
    jobRoleUpdatePage.jobSectorField().select('OFFICE')
    jobRoleUpdatePage.industrySectorField().select('ADMIN_SUPPORT')
    jobRoleUpdatePage.numberOfVacanciesField().type('1')
    jobRoleUpdatePage.jobSourceField().select('NFN')
    jobRoleUpdatePage.jobSource2Field().select('PEL')
    jobRoleUpdatePage.charityField().type('Test charity')

    jobRoleUpdatePage.submitButton().click()

    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')

    jobContractUpdatePage.postcodeField().type('NE157LR')
    jobContractUpdatePage.salaryFromField().type('25000')
    jobContractUpdatePage.salaryPeriodField().select('PER_YEAR')
    jobContractUpdatePage.nationalMinimumWageYes().click()
    jobContractUpdatePage.workPatternField().select('FLEXI_TIME')
    jobContractUpdatePage.contractTypeField().select('PERMANENT')
    jobContractUpdatePage.hoursField().select('FULL_TIME')

    jobContractUpdatePage.submitButton().click()
  })
})
