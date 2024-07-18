/* eslint-disable @typescript-eslint/no-unused-vars */
import JobRoleUpdatePage from '../pages/jobs/jobRoleUpdate'
import JobContractUpdatePage from '../pages/jobs/jobContractUpdate'
import JobRequirementsUpdatePage from '../pages/jobs/jobRequirementsUpdate'

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

    // Job role and source page
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

    // Job location and contract page
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

    // Field errors
    jobContractUpdatePage.postcodeFieldErrorMessage().contains('Enter a job location')
    jobContractUpdatePage.salaryFromFieldErrorMessage().contains('Enter minimum salary amount')
    jobContractUpdatePage.salaryPeriodFieldErrorMessage().contains('Select a salary period')
    jobContractUpdatePage
      .nationalMinimumWageFieldErrorMessage()
      .contains('Select whether the job pays minimum wage or not')
    jobContractUpdatePage.workPatternFieldErrorMessage().contains('Select a work pattern')
    jobContractUpdatePage.contractTypeFieldErrorMessage().contains('Select a contract type')
    jobContractUpdatePage.hoursFieldErrorMessage().contains('Select the hours for this job')

    // Move to next page
    jobContractUpdatePage.postcodeField().type('NE157LR')
    jobContractUpdatePage.salaryFromField().type('25000')
    jobContractUpdatePage.salaryPeriodField().select('PER_YEAR')
    jobContractUpdatePage.nationalMinimumWageYes().click()
    jobContractUpdatePage.workPatternField().select('FLEXI_TIME')
    jobContractUpdatePage.contractTypeField().select('PERMANENT')
    jobContractUpdatePage.hoursField().select('FULL_TIME')

    jobContractUpdatePage.submitButton().click()

    // Requirements and job description
    const jobRequirementsUpdatePage = new JobRequirementsUpdatePage('Requirements and job description')
    jobRequirementsUpdatePage.submitButton().click()

    // Page errors
    jobRequirementsUpdatePage.essentialCriteriaPageErrorMessage().contains('Enter essential job requirements')
    jobRequirementsUpdatePage.jobDescriptionPageErrorMessage().contains('Enter job description')
    jobRequirementsUpdatePage
      .offenceExclusionsPageErrorMessage()
      .contains('Select one or more options in offence exclusions')

    // Field errors
    jobRequirementsUpdatePage.essentialCriteriaFieldErrorMessage().contains('Enter essential job requirements')
    jobRequirementsUpdatePage.jobDescriptionFieldErrorMessage().contains('Enter job description')
    jobRequirementsUpdatePage
      .offenceExclusionsFieldErrorMessage()
      .contains('Select one or more options in offence exclusions')
  })

  it('Create job flow', () => {
    cy.visit('/jobs/job/new/role')

    // Job role and source page
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

    // Job location and contract page
    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')
    jobContractUpdatePage.headerCaption().contains('Add a job - step 2 of 5')

    jobContractUpdatePage.postcodeField().type('NE157LR')
    jobContractUpdatePage.salaryFromField().type('25000')
    jobContractUpdatePage.salaryPeriodField().select('PER_YEAR')
    jobContractUpdatePage.nationalMinimumWageYes().click()
    jobContractUpdatePage.workPatternField().select('FLEXI_TIME')
    jobContractUpdatePage.contractTypeField().select('PERMANENT')
    jobContractUpdatePage.hoursField().select('FULL_TIME')

    jobContractUpdatePage.submitButton().click()

    // Requirements and job description page
    const jobRequirementsUpdatePage = new JobRequirementsUpdatePage('Requirements and job description')
    jobContractUpdatePage.headerCaption().contains('Add a job - step 3 of 5')

    jobRequirementsUpdatePage.essentialCriteriaField().type('Some text')
    jobRequirementsUpdatePage.jobDescriptionField().type('Some text')
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('NONE').click()

    jobRequirementsUpdatePage.submitButton().click()
  })
})
