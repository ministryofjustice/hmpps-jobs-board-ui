/* eslint-disable @typescript-eslint/no-unused-vars */
import JobRoleUpdatePage from '../pages/jobs/jobRoleUpdate'
import JobContractUpdatePage from '../pages/jobs/jobContractUpdate'
import JobRequirementsUpdatePage from '../pages/jobs/jobRequirementsUpdate'
import JobHowToApplyPage from '../pages/jobs/jobContractHowToApply'
import JobReviewPage from '../pages/jobs/jobReview'
import IndexPage from '../pages'

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
  })

  it('Validation error display', () => {
    cy.visit('/jobs/job/new/role/add')

    // Job role and source page
    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')

    jobRoleUpdatePage.submitButton().click()

    // Page errors
    jobRoleUpdatePage.employerIdPageErrorMessage().contains("Select employer or select 'Add an employer'")
    jobRoleUpdatePage.jobTitlePageErrorMessage().contains('Job title must be 3 characters or more')
    jobRoleUpdatePage.sectorPageErrorMessage().contains('Select a job sector')
    jobRoleUpdatePage.industrySectorPageErrorMessage().contains('Select an HMPPS reporting industry sector')
    jobRoleUpdatePage.numberOfVacanciesPageErrorMessage().contains('Enter number of vacancies')
    jobRoleUpdatePage.sourcePrimaryPageErrorMessage().contains('Select a job source')

    // Field errors
    jobRoleUpdatePage.employerIdFieldErrorMessage().contains("Select employer or select 'Add an employer'")
    jobRoleUpdatePage.jobTitleFieldErrorMessage().contains('Job title must be 3 characters or more')
    jobRoleUpdatePage.sectorFieldErrorMessage().contains('Select a job sector')
    jobRoleUpdatePage.industrySectorFieldErrorMessage().contains('Select an HMPPS reporting industry sector')
    jobRoleUpdatePage.numberOfVacanciesFieldErrorMessage().contains('Enter number of vacancies')
    jobRoleUpdatePage.sourcePrimaryFieldErrorMessage().contains('Select a job source')

    // Move to next page
    jobRoleUpdatePage.employerIdField().type('ASDA')
    jobRoleUpdatePage.employerIdFieldOption(0).click()
    jobRoleUpdatePage.jobTitleField().type('Test job')
    jobRoleUpdatePage.sectorField().select('OFFICE')
    jobRoleUpdatePage.industrySectorField().select('ADMIN_SUPPORT')
    jobRoleUpdatePage.numberOfVacanciesField().type('1')
    jobRoleUpdatePage.sourcePrimaryField().select('NFN')
    jobRoleUpdatePage.sourceSecondaryField().select('PEL')
    jobRoleUpdatePage.charityNameField().type('Test charity')

    jobRoleUpdatePage.submitButton().click()

    // Job location and contract page
    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')

    jobContractUpdatePage.submitButton().click()

    jobContractUpdatePage.postCodePageErrorMessage().contains('Enter a job location')
    jobContractUpdatePage.salaryFromPageErrorMessage().contains('Enter minimum salary amount')
    jobContractUpdatePage.salaryPeriodPageErrorMessage().contains('Select a salary period')
    jobContractUpdatePage
      .isPayingAtLeastNationalMinimumWagePageErrorMessage()
      .contains('Select whether the job pays minimum wage or not')
    jobContractUpdatePage.workPatternPageErrorMessage().contains('Select a work pattern')
    jobContractUpdatePage.contractTypePageErrorMessage().contains('Select a contract type')
    jobContractUpdatePage.hoursPerWeekPageErrorMessage().contains('Select the hours for this job')

    // Field errors
    jobContractUpdatePage.postCodeFieldErrorMessage().contains('Enter a job location')
    jobContractUpdatePage.salaryFromFieldErrorMessage().contains('Enter minimum salary amount')
    jobContractUpdatePage.salaryPeriodFieldErrorMessage().contains('Select a salary period')
    jobContractUpdatePage
      .isPayingAtLeastNationalMinimumWageFieldErrorMessage()
      .contains('Select whether the job pays minimum wage or not')
    jobContractUpdatePage.workPatternFieldErrorMessage().contains('Select a work pattern')
    jobContractUpdatePage.contractTypeFieldErrorMessage().contains('Select a contract type')
    jobContractUpdatePage.hoursPerWeekFieldErrorMessage().contains('Select the hours for this job')

    // Move to next page
    jobContractUpdatePage.postCodeField().type('NE157LR')
    jobContractUpdatePage.salaryFromField().type('25000')
    jobContractUpdatePage.salaryPeriodField().select('PER_YEAR')
    jobContractUpdatePage.isPayingAtLeastNationalMinimumWageYes().click()
    jobContractUpdatePage.workPatternField().select('FLEXI_TIME')
    jobContractUpdatePage.contractTypeField().select('PERMANENT')
    jobContractUpdatePage.hoursPerWeekField().select('FULL_TIME')

    jobContractUpdatePage.submitButton().click()

    // Requirements and job description
    const jobRequirementsUpdatePage = new JobRequirementsUpdatePage('Requirements and job description')
    jobRequirementsUpdatePage.submitButton().click()

    // Page errors
    jobRequirementsUpdatePage.essentialCriteriaPageErrorMessage().contains('Enter essential job requirements')
    jobRequirementsUpdatePage.descriptionPageErrorMessage().contains('Enter job description')
    jobRequirementsUpdatePage
      .offenceExclusionsPageErrorMessage()
      .contains('Select one or more options in offence exclusions')

    // Field errors
    jobRequirementsUpdatePage.essentialCriteriaFieldErrorMessage().contains('Enter essential job requirements')
    jobRequirementsUpdatePage.descriptionFieldErrorMessage().contains('Enter job description')
    jobRequirementsUpdatePage
      .offenceExclusionsFieldErrorMessage()
      .contains('Select one or more options in offence exclusions')

    // Move to next page
    jobRequirementsUpdatePage.essentialCriteriaField().type('Some text')
    jobRequirementsUpdatePage.descriptionField().type('Some text')
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('NONE').click()
    jobRequirementsUpdatePage.submitButton().click()

    const jobHowToApplyPage = new JobHowToApplyPage('How to apply')
    jobHowToApplyPage.submitButton().click()

    // Page errors
    jobHowToApplyPage
      .isRollingOpportunityPageErrorMessage()
      .contains('Select whether the job is a rolling opportunity or not')
    jobHowToApplyPage
      .isOnlyForPrisonLeaversPageErrorMessage()
      .contains('Select an answer to whether this job is only for prison leavers')
    jobHowToApplyPage.howToApplyPageErrorMessage().contains('Enter how to apply details')

    // Field errors
    jobHowToApplyPage
      .isRollingOpportunityFieldErrorMessage()
      .contains('Select whether the job is a rolling opportunity or not')
    jobHowToApplyPage
      .isOnlyForPrisonLeaversFieldErrorMessage()
      .contains('Select an answer to whether this job is only for prison leavers')
    jobHowToApplyPage.howToApplyFieldErrorMessage().contains('Enter how to apply details')
  })

  it('Create job flow', () => {
    cy.visit('/jobs/job/new/role/add')

    // Job role and source page
    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
    jobRoleUpdatePage.headerCaption().contains('Add a job - step 1 of 5')

    jobRoleUpdatePage.employerIdField().type('ASDA')
    jobRoleUpdatePage.employerIdFieldOption(0).click()
    jobRoleUpdatePage.jobTitleField().type('Test job')
    jobRoleUpdatePage.sectorField().select('OFFICE')
    jobRoleUpdatePage.industrySectorField().select('ADMIN_SUPPORT')
    jobRoleUpdatePage.numberOfVacanciesField().type('1')
    jobRoleUpdatePage.sourcePrimaryField().select('NFN')
    jobRoleUpdatePage.sourceSecondaryField().select('PEL')
    jobRoleUpdatePage.charityNameField().type('Test charity')

    jobRoleUpdatePage.submitButton().click()

    // Job location and contract page
    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')
    jobContractUpdatePage.headerCaption().contains('Add a job - step 2 of 5')

    jobContractUpdatePage.postCodeField().type('NE157LR')
    jobContractUpdatePage.salaryFromField().type('25000')
    jobContractUpdatePage.salaryPeriodField().select('PER_YEAR')
    jobContractUpdatePage.isPayingAtLeastNationalMinimumWageYes().click()
    jobContractUpdatePage.workPatternField().select('FLEXI_TIME')
    jobContractUpdatePage.contractTypeField().select('PERMANENT')
    jobContractUpdatePage.hoursPerWeekField().select('FULL_TIME')

    jobContractUpdatePage.submitButton().click()

    // Requirements and job description page
    const jobRequirementsUpdatePage = new JobRequirementsUpdatePage('Requirements and job description')
    jobContractUpdatePage.headerCaption().contains('Add a job - step 3 of 5')

    jobRequirementsUpdatePage.essentialCriteriaField().type('Some text')
    jobRequirementsUpdatePage.descriptionField().type('Some text')
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('OTHER').click()
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('NONE').click()
    jobRequirementsUpdatePage.offenceExclusionsDetailsField().type('Some text')

    jobRequirementsUpdatePage.submitButton().click()

    // How to apply page
    const jobHowToApplyPage = new JobHowToApplyPage('How to apply')
    jobHowToApplyPage.headerCaption().contains('Add a job - step 4 of 5')

    jobHowToApplyPage.isRollingOpportunityFieldNo().click()
    jobHowToApplyPage.closingDateField.day().type('1')
    jobHowToApplyPage.closingDateField.month().type('1')
    jobHowToApplyPage.closingDateField.year().type('2026')
    jobHowToApplyPage.isOnlyForPrisonLeaversFieldYes().click()
    jobHowToApplyPage.howToApplyField().type('Some text')
    jobHowToApplyPage.startDateField.day().type('1')
    jobHowToApplyPage.startDateField.month().type('1')
    jobHowToApplyPage.startDateField.year().type('2026')
    jobHowToApplyPage.supportingDocumentationRequiredFieldValue('OTHER').click()
    jobHowToApplyPage.supportingDocumentationDetailsField().type('Some text')

    jobHowToApplyPage.submitButton().click()

    const jobReviewPage = new JobReviewPage('Check your answers before adding job')
    jobReviewPage.headerCaption().contains('Add a job - step 5 of 5')

    jobReviewPage.employerId().contains('ASDA')
    jobReviewPage.jobTitle().contains('Test job')
    jobReviewPage.sector().contains('Office or desk-based')
    jobReviewPage.industrySector().contains('Administration and support services')
    jobReviewPage.numberOfVacancies().contains('1')
    jobReviewPage.sourcePrimary().contains('NFN')
    jobReviewPage.sourceSecondary().contains('PEL')
    jobReviewPage.charityName().contains('Test charity')
    jobReviewPage.postCode().contains('NE157LR')
    jobReviewPage.salaryFrom().contains('£25000.00')
    jobReviewPage.salaryTo().contains('Not provided')
    jobReviewPage.salaryPeriod().contains('Per year')
    jobReviewPage.additionalSalaryInformation().contains('Not provided')
    jobReviewPage.isPayingAtLeastNationalMinimumWage().contains('Yes')
    jobReviewPage.workPattern().contains('Flexi-time')
    jobReviewPage.contractType().contains('Permanent')
    jobReviewPage.hoursPerWeek().contains('Full-time (more than 30-39 hours)')
    jobReviewPage.baseLocation().contains('Not provided')
    jobReviewPage.essentialCriteria().contains('Some text')
    jobReviewPage.desirableCriteria().contains('Not provided')
    jobReviewPage.description().contains('Some text')
    jobReviewPage.offenceExclusions().contains('None')
    jobReviewPage.offenceExclusions().contains('Other - Some text')
    jobReviewPage.isRollingOpportunity().contains('No')
    jobReviewPage.closingDate().contains(' 1 January 2026')
    jobReviewPage.isOnlyForPrisonLeavers().contains('Yes')
    jobReviewPage.startDate().contains('1 January 2026')
    jobReviewPage.howToApply().contains('Some text')
    jobReviewPage.supportingDocumentationRequired().contains('Other - Some text')

    jobReviewPage.submitButton().click()

    const indexPage = new IndexPage('Add jobs and employers')
  })

  it('Create job - change links flow', () => {
    cy.visit('/jobs/job/new/role/add')

    // Job role and source page
    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
    jobRoleUpdatePage.headerCaption().contains('Add a job - step 1 of 5')

    jobRoleUpdatePage.employerIdField().type('ASDA')
    jobRoleUpdatePage.employerIdFieldOption(0).click()
    jobRoleUpdatePage.jobTitleField().type('Test job')
    jobRoleUpdatePage.sectorField().select('OFFICE')
    jobRoleUpdatePage.industrySectorField().select('ADMIN_SUPPORT')
    jobRoleUpdatePage.numberOfVacanciesField().type('1')
    jobRoleUpdatePage.sourcePrimaryField().select('NFN')
    jobRoleUpdatePage.sourceSecondaryField().select('PEL')
    jobRoleUpdatePage.charityNameField().type('Test charity')

    jobRoleUpdatePage.submitButton().click()

    // Job location and contract page
    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')
    jobContractUpdatePage.headerCaption().contains('Add a job - step 2 of 5')

    jobContractUpdatePage.postCodeField().type('NE157LR')
    jobContractUpdatePage.salaryFromField().type('25000')
    jobContractUpdatePage.salaryPeriodField().select('PER_YEAR')
    jobContractUpdatePage.isPayingAtLeastNationalMinimumWageYes().click()
    jobContractUpdatePage.workPatternField().select('FLEXI_TIME')
    jobContractUpdatePage.contractTypeField().select('PERMANENT')
    jobContractUpdatePage.hoursPerWeekField().select('FULL_TIME')

    jobContractUpdatePage.submitButton().click()

    // Requirements and job description page
    const jobRequirementsUpdatePage = new JobRequirementsUpdatePage('Requirements and job description')
    jobContractUpdatePage.headerCaption().contains('Add a job - step 3 of 5')

    jobRequirementsUpdatePage.essentialCriteriaField().type('Some text')
    jobRequirementsUpdatePage.descriptionField().type('Some text')
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('NONE').click()

    jobRequirementsUpdatePage.submitButton().click()

    // How to apply page
    const jobHowToApplyPage = new JobHowToApplyPage('How to apply')
    jobHowToApplyPage.headerCaption().contains('Add a job - step 4 of 5')

    jobHowToApplyPage.isRollingOpportunityFieldNo().click()
    jobHowToApplyPage.closingDateField.day().type('1')
    jobHowToApplyPage.closingDateField.month().type('1')
    jobHowToApplyPage.closingDateField.year().type('2026')
    jobHowToApplyPage.isOnlyForPrisonLeaversFieldYes().click()
    jobHowToApplyPage.howToApplyField().type('Some text')
    jobHowToApplyPage.startDateField.day().type('1')
    jobHowToApplyPage.startDateField.month().type('1')
    jobHowToApplyPage.startDateField.year().type('2026')
    jobHowToApplyPage.supportingDocumentationRequiredFieldValue('OTHER').click()
    jobHowToApplyPage.supportingDocumentationDetailsField().type('Some text')

    jobHowToApplyPage.submitButton().click()

    // Check change links function correctly and update values

    // Role page changes
    const jobReviewPage = new JobReviewPage('Check your answers before adding job')
    jobReviewPage.headerCaption().contains('Add a job - step 5 of 5')

    jobReviewPage.employerIdLink().click()
    jobRoleUpdatePage.employerIdField().clear().type('Tesco')
    jobRoleUpdatePage.employerIdFieldOption(0).click()
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.employerId().contains('Tesco')

    jobReviewPage.jobTitleLink().click()
    jobRoleUpdatePage.jobTitleField().clear().type('A different job')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.jobTitle().contains('A different job')

    jobReviewPage.sectorLink().click()
    jobRoleUpdatePage.sectorField().select('RETAIL')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.sector().contains('Retail and sales')

    jobReviewPage.industrySectorLink().click()
    jobRoleUpdatePage.industrySectorField().select('RETAIL')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.industrySector().contains('Retail (includes wholesale and motor vehicle repair)')

    jobReviewPage.numberOfVacanciesLink().click()
    jobRoleUpdatePage.numberOfVacanciesField().clear().type('2')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.numberOfVacancies().contains('2')

    jobReviewPage.sourcePrimaryLink().click()
    jobRoleUpdatePage.sourcePrimaryField().select('PRISON')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.sourcePrimary().contains('Prison')

    jobReviewPage.sourceSecondaryLink().click()
    jobRoleUpdatePage.sourceSecondaryField().select('PRISON')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.sourceSecondary().contains('Prison')

    jobReviewPage.charityNameLink().click()
    jobRoleUpdatePage.charityNameField().clear().type('Another charity')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.charityName().contains('Another charity')

    // Contract page changes
    jobReviewPage.postCodeLink().click()
    jobContractUpdatePage.postCodeField().clear().type('NE356DR')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.postCode().contains('NE356DR')

    jobReviewPage.salaryFromLink().click()
    jobContractUpdatePage.salaryFromField().clear().type('350.99')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.salaryFrom().contains('350.99')

    jobReviewPage.salaryToLink().click()
    jobContractUpdatePage.salaryToField().clear().type('450.99')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.salaryTo().contains('450.99')

    jobReviewPage.salaryPeriodLink().click()
    jobContractUpdatePage.salaryPeriodField().select('PER_DAY')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.salaryPeriod().contains('Per day')

    jobReviewPage.isPayingAtLeastNationalMinimumWageLink().click()
    jobContractUpdatePage.isPayingAtLeastNationalMinimumWageNo().click()
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.isPayingAtLeastNationalMinimumWage().contains('No')

    jobReviewPage.workPatternLink().click()
    jobContractUpdatePage.workPatternField().select('ANNUALISED_HOURS')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.workPattern().contains('Annualised hours')

    jobReviewPage.contractTypeLink().click()
    jobContractUpdatePage.contractTypeField().select('TEMPORARY')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.contractType().contains('Temporary')

    jobReviewPage.hoursPerWeekLink().click()
    jobContractUpdatePage.hoursPerWeekField().select('PART_TIME')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.hoursPerWeek().contains('Part-time (less than 30 hours)')

    jobReviewPage.additionalSalaryInformationLink().click()
    jobContractUpdatePage.additionalSalaryInformationField().clear().type('Some info')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.additionalSalaryInformation().contains('Some info')

    jobReviewPage.baseLocationLink().click()
    jobContractUpdatePage.baseLocationField().select('WORKPLACE')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.baseLocation().contains('Workplace')

    // Requirements page changes
    jobReviewPage.essentialCriteriaLink().click()
    jobRequirementsUpdatePage.essentialCriteriaField().clear().type('Some essential text')
    jobRequirementsUpdatePage.submitButton().click()
    jobReviewPage.essentialCriteria().contains('Some essential text')

    jobReviewPage.desirableCriteriaLink().click()
    jobRequirementsUpdatePage.desirableCriteriaField().clear().type('Some desirable text')
    jobRequirementsUpdatePage.submitButton().click()
    jobReviewPage.desirableCriteria().contains('Some desirable text')

    jobReviewPage.descriptionLink().click()
    jobRequirementsUpdatePage.descriptionField().clear().type('Some descriptive text')
    jobRequirementsUpdatePage.submitButton().click()
    jobReviewPage.description().contains('Some descriptive text')

    jobReviewPage.offenceExclusionsLink().click()
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('NONE').click()
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('ARSON').click()
    jobRequirementsUpdatePage.submitButton().click()
    jobReviewPage.offenceExclusions().contains('Arson')

    // How to apply page changes
    jobReviewPage.isRollingOpportunityLink().click()
    jobHowToApplyPage.isRollingOpportunityFieldYes().click()
    jobHowToApplyPage.submitButton().click()
    jobReviewPage.isRollingOpportunity().contains('Yes')

    jobReviewPage.startDateLink().click()
    jobHowToApplyPage.startDateField.day().clear().type('2')
    jobHowToApplyPage.startDateField.month().clear().type('3')
    jobHowToApplyPage.startDateField.year().clear().type('2027')
    jobHowToApplyPage.submitButton().click()
    jobReviewPage.startDate().contains('2 March 2027')

    jobReviewPage.isOnlyForPrisonLeaversLink().click()
    jobHowToApplyPage.isOnlyForPrisonLeaversFieldNo().click()
    jobHowToApplyPage.submitButton().click()
    jobReviewPage.isOnlyForPrisonLeavers().contains('No')

    jobReviewPage.howToApplyLink().click()
    jobHowToApplyPage.howToApplyField().clear().type('Some info to apply')
    jobHowToApplyPage.submitButton().click()
    jobReviewPage.howToApply().contains('Some info to apply')

    jobReviewPage.supportingDocumentationRequiredLink().click()
    jobHowToApplyPage.supportingDocumentationRequiredFieldValue('CV').click()
    jobHowToApplyPage.supportingDocumentationDetailsField().clear().type('Some more text')
    jobHowToApplyPage.submitButton().click()
    jobReviewPage.supportingDocumentationRequired().contains('CV')
    jobReviewPage.supportingDocumentationRequired().contains('Some more text')
  })
})
