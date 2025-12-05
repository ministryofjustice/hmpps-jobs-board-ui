/* eslint-disable @typescript-eslint/no-unused-vars */
import { skipOn } from '@cypress/skip-test'
import JobHowToApplyPage from '../pages/jobs/jobContractHowToApply'
import JobContractUpdatePage from '../pages/jobs/jobContractUpdate'
import JobRequirementsUpdatePage from '../pages/jobs/jobRequirementsUpdate'
import JobReviewPage from '../pages/jobs/jobReview'
import JobRoleUpdatePage from '../pages/jobs/jobRoleUpdate'
import JobIsNationalUpdatePage from '../pages/jobs/jobIsNationalUpdate'
import JobDuplicatePage from '../pages/jobs/jobDuplicate'

context('Sign In', () => {
  beforeEach(() => {
    // // Skip tests if broker iteration is not enabled
    // cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
    //   skipOn(!isEnabled)
    // })
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('putJob')
    cy.task('getEmployers', { page: 1 })
    cy.task('getJobs', { page: 1 })
    cy.signIn()
  })

  it('Duplicate job flow - check loaded content - non-national job', () => {
    // Skip tests if broker iteration is not enabled
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      skipOn(!isEnabled)
    })

    cy.task('getJob')
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      cy.wrap(isEnabled).as('nationalJobsEnabled')
    })

    cy.visit('/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e/duplicate')

    const jobDuplicatePage = new JobDuplicatePage('Warehouse operator')

    jobDuplicatePage.employerId().contains('ASDA')
    jobDuplicatePage.jobTitle().contains('Warehouse operator')
    jobDuplicatePage.sector().contains('Warehousing and storage')
    jobDuplicatePage.industrySector().contains('Administration and support services')
    jobDuplicatePage.numberOfVacancies().contains('1')
    jobDuplicatePage.sourcePrimary().contains('NFN')
    jobDuplicatePage.sourceSecondary().contains('PEL')
    jobDuplicatePage.charityName().contains('Heart foundation')
    jobDuplicatePage.postCode().contains('NE236DR')

    // Expect national job field iff feature enabled
    cy.get('@nationalJobsEnabled').then(isEnabled => {
      if (isEnabled) {
        jobDuplicatePage.isNational().contains('No')
      }
    })

    jobDuplicatePage.salaryFrom().contains('£25000.00')
    jobDuplicatePage.salaryTo().contains('£30000.00')
    jobDuplicatePage.salaryPeriod().contains('Per year')
    jobDuplicatePage.additionalSalaryInformation().contains('10% Performance bonus')
    jobDuplicatePage.isPayingAtLeastNationalMinimumWage().contains('Yes')
    jobDuplicatePage.workPattern().contains('Flexi-time')
    jobDuplicatePage.contractType().contains('Permanent')
    jobDuplicatePage.hoursPerWeek().contains('Full-time (more than 40 hours)')
    jobDuplicatePage.baseLocation().contains('Workplace')
    jobDuplicatePage.essentialCriteria().contains('Some essential criteria')
    jobDuplicatePage.desirableCriteria().contains('Some desirable criteria')
    jobDuplicatePage.description().contains('Some job description')
    jobDuplicatePage.offenceExclusions().contains('Arson')
    jobDuplicatePage.offenceExclusions().contains('Terrorism')
    jobDuplicatePage.offenceExclusions().contains('Arson')
    jobDuplicatePage.offenceExclusions().contains('Other - Some details')
    jobDuplicatePage.isRollingOpportunity().contains('No')
    jobDuplicatePage.closingDate().contains('1 February 2025')
    jobDuplicatePage.isOnlyForPrisonLeavers().contains('Yes')
    jobDuplicatePage.startDate().contains('1 June 2025')
    jobDuplicatePage.howToApply().contains('Some apply details')
    jobDuplicatePage.supportingDocumentationRequired().contains('CV')
    jobDuplicatePage.supportingDocumentationRequired().contains('Other - Covering letter')

    jobDuplicatePage.submitButton().click() // TODO: Once check-details page is implemented, check onwards behaviour up to submitting the duplicated job.
    cy.url().should('include', '/jobs/job/new/check-details')
  })

  it('Duplicate job flow - check loaded content - national job', () => {
    // Skip tests if broker iteration is not enabled
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      skipOn(!isEnabled)
    })
    // Skip this test if national jobs is not enabled
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      skipOn(!isEnabled)
    })

    cy.task('getNationalJob')

    cy.visit('/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e/duplicate')

    const jobDuplicatePage = new JobDuplicatePage('National Warehouse operator')

    jobDuplicatePage.employerId().contains('ASDA')
    jobDuplicatePage.jobTitle().contains('Warehouse operator')
    jobDuplicatePage.sector().contains('Warehousing and storage')
    jobDuplicatePage.industrySector().contains('Administration and support services')
    jobDuplicatePage.numberOfVacancies().contains('1')
    jobDuplicatePage.sourcePrimary().contains('NFN')
    jobDuplicatePage.sourceSecondary().contains('PEL')
    jobDuplicatePage.charityName().contains('Heart foundation')
    jobDuplicatePage.isNational().contains('Yes')
    jobDuplicatePage.salaryFrom().contains('£25000.00')
    jobDuplicatePage.salaryTo().contains('£30000.00')
    jobDuplicatePage.salaryPeriod().contains('Per year')
    jobDuplicatePage.additionalSalaryInformation().contains('10% Performance bonus')
    jobDuplicatePage.isPayingAtLeastNationalMinimumWage().contains('Yes')
    jobDuplicatePage.workPattern().contains('Flexi-time')
    jobDuplicatePage.contractType().contains('Permanent')
    jobDuplicatePage.hoursPerWeek().contains('Full-time (more than 40 hours)')
    jobDuplicatePage.baseLocation().contains('Workplace')
    jobDuplicatePage.essentialCriteria().contains('Some essential criteria')
    jobDuplicatePage.desirableCriteria().contains('Some desirable criteria')
    jobDuplicatePage.description().contains('Some job description')
    jobDuplicatePage.offenceExclusions().contains('Arson')
    jobDuplicatePage.offenceExclusions().contains('Terrorism')
    jobDuplicatePage.offenceExclusions().contains('Arson')
    jobDuplicatePage.offenceExclusions().contains('Other - Some details')
    jobDuplicatePage.isRollingOpportunity().contains('No')
    jobDuplicatePage.closingDate().contains('1 February 2025')
    jobDuplicatePage.isOnlyForPrisonLeavers().contains('Yes')
    jobDuplicatePage.startDate().contains('1 June 2025')
    jobDuplicatePage.howToApply().contains('Some apply details')
    jobDuplicatePage.supportingDocumentationRequired().contains('CV')
    jobDuplicatePage.supportingDocumentationRequired().contains('Other - Covering letter')

    jobDuplicatePage.submitButton().click() // TODO: Check this redirects to the check-details page
    // TODO: Once check-details page is implemented, check onwards behaviour up to submitting the duplicated job.
    cy.url().should('include', '/jobs/job/new/check-details')
  })

  it('Duplicate job - change links flow - without national jobs', () => {
    // Skip tests if broker iteration is not enabled
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      skipOn(!isEnabled)
    })
    // Skip this test if national jobs enabled.
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      skipOn(isEnabled)
    })

    cy.task('getJob')

    cy.visit('/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e/duplicate')

    const jobDuplicatePage = new JobDuplicatePage('Warehouse operator')

    jobDuplicatePage.employerIdLink().click()
    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
    jobRoleUpdatePage.headerCaption().contains('Update a job - step 1 of 5')

    jobRoleUpdatePage.employerIdField().clear().type('Tesco')
    jobRoleUpdatePage.employerIdFieldOption(0).click()
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.employerId().contains('Tesco')

    jobDuplicatePage.jobTitleLink().click()
    jobRoleUpdatePage.jobTitleField().clear().type('A different job')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.jobTitle().contains('A different job')

    jobDuplicatePage.sectorLink().click()
    jobRoleUpdatePage.sectorField().select('RETAIL')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.sector().contains('Retail and sales')

    jobDuplicatePage.industrySectorLink().click()
    jobRoleUpdatePage.industrySectorField().select('RETAIL')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.industrySector().contains('Retail (includes wholesale and motor vehicle repair)')

    jobDuplicatePage.numberOfVacanciesLink().click()
    jobRoleUpdatePage.numberOfVacanciesField().clear().type('2')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.numberOfVacancies().contains('2')

    jobDuplicatePage.sourcePrimaryLink().click()
    jobRoleUpdatePage.sourcePrimaryField().select('PRISON')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.sourcePrimary().contains('Prison')

    jobDuplicatePage.sourceSecondaryLink().click()
    jobRoleUpdatePage.sourceSecondaryField().select('NFN')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.sourceSecondary().contains('NFN')

    jobDuplicatePage.charityNameLink().click()
    jobRoleUpdatePage.charityNameField().clear().type('Another charity')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.charityName().contains('Another charity')

    // Contract page changes
    jobDuplicatePage.postCodeLink().click()
    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')
    jobContractUpdatePage.headerCaption().contains('Update a job - step 2 of 5')

    jobContractUpdatePage.postCodeField().clear().type('NE35 6DR')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.postCode().contains('NE35 6DR')

    jobDuplicatePage.salaryFromLink().click()
    jobContractUpdatePage.salaryFromField().clear().type('350.99')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.salaryFrom().contains('350.99')

    jobDuplicatePage.salaryToLink().click()
    jobContractUpdatePage.salaryToField().clear().type('450.99')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.salaryTo().contains('450.99')

    jobDuplicatePage.salaryPeriodLink().click()
    jobContractUpdatePage.salaryPeriodField().select('PER_DAY')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.salaryPeriod().contains('Per day')

    jobDuplicatePage.isPayingAtLeastNationalMinimumWageLink().click()
    jobContractUpdatePage.isPayingAtLeastNationalMinimumWageNo().click()
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.isPayingAtLeastNationalMinimumWage().contains('No')

    jobDuplicatePage.workPatternLink().click()
    jobContractUpdatePage.workPatternField().select('ANNUALISED_HOURS')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.workPattern().contains('Annualised hours')

    jobDuplicatePage.contractTypeLink().click()
    jobContractUpdatePage.contractTypeField().select('TEMPORARY')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.contractType().contains('Temporary')

    jobDuplicatePage.hoursPerWeekLink().click()
    jobContractUpdatePage.hoursPerWeekField().select('PART_TIME')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.hoursPerWeek().contains('Part-time (less than 30 hours)')

    jobDuplicatePage.additionalSalaryInformationLink().click()
    jobContractUpdatePage.additionalSalaryInformationField().clear().type('Some info')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.additionalSalaryInformation().contains('Some info')

    jobDuplicatePage.baseLocationLink().click()
    jobContractUpdatePage.baseLocationField().select('WORKPLACE')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.baseLocation().contains('Workplace')

    // Requirements page changes
    jobDuplicatePage.essentialCriteriaLink().click()
    const jobRequirementsUpdatePage = new JobRequirementsUpdatePage('Requirements and job description')
    jobContractUpdatePage.headerCaption().contains('Update a job - step 3 of 5')

    jobRequirementsUpdatePage.essentialCriteriaField().clear().type('Some essential text')
    jobRequirementsUpdatePage.submitButton().click()
    jobDuplicatePage.essentialCriteria().contains('Some essential text')

    jobDuplicatePage.desirableCriteriaLink().click()
    jobRequirementsUpdatePage.desirableCriteriaField().clear().type('Some desirable text')
    jobRequirementsUpdatePage.submitButton().click()
    jobDuplicatePage.desirableCriteria().contains('Some desirable text')

    jobDuplicatePage.descriptionLink().click()
    jobRequirementsUpdatePage.descriptionField().clear().type('Some descriptive text')
    jobRequirementsUpdatePage.submitButton().click()
    jobDuplicatePage.description().contains('Some descriptive text')

    jobDuplicatePage.offenceExclusionsLink().click()
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('MURDER').click()
    jobRequirementsUpdatePage.offenceExclusionsDetailsField().clear().type('Some text')
    jobRequirementsUpdatePage.submitButton().click()
    jobDuplicatePage.offenceExclusions().contains('Murder')
    jobDuplicatePage.offenceExclusions().contains('Other - Some text')

    // How to apply page changes
    jobDuplicatePage.closingDateLink().click()
    const jobHowToApplyPage = new JobHowToApplyPage('How to apply')
    jobHowToApplyPage.headerCaption().contains('Update a job - step 4 of 5')

    jobHowToApplyPage.closingDateField.day().clear().type('3')
    jobHowToApplyPage.closingDateField.month().clear().type('4')
    jobHowToApplyPage.closingDateField.year().clear().type('2027')
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.closingDate().contains('3 April 2027')

    jobDuplicatePage.isRollingOpportunityLink().click()
    jobHowToApplyPage.isRollingOpportunityFieldYes().click()
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.isRollingOpportunity().contains('Yes')

    jobDuplicatePage.startDateLink().click()
    jobHowToApplyPage.startDateField.day().clear().type('2')
    jobHowToApplyPage.startDateField.month().clear().type('3')
    jobHowToApplyPage.startDateField.year().clear().type('2027')
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.startDate().contains('2 March 2027')

    jobDuplicatePage.isOnlyForPrisonLeaversLink().click()
    jobHowToApplyPage.isOnlyForPrisonLeaversFieldNo().click()
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.isOnlyForPrisonLeavers().contains('No')

    jobDuplicatePage.howToApplyLink().click()
    jobHowToApplyPage.howToApplyField().clear().type('Some info to apply')
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.howToApply().contains('Some info to apply')

    jobDuplicatePage.supportingDocumentationRequiredLink().click()
    jobHowToApplyPage.supportingDocumentationRequiredFieldValue('DISCLOSURE_LETTER').click()
    jobHowToApplyPage.supportingDocumentationDetailsField().clear().type('Some more text')
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.supportingDocumentationRequired().contains('Disclosure letter')
    jobDuplicatePage.supportingDocumentationRequired().contains('Some more text')
  })

  it('Duplicate job - change links flow - with national jobs', () => {
    // Skip tests if broker iteration is not enabled
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      skipOn(!isEnabled)
    })
    // Skip this test if national jobs not enabled.
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      skipOn(!isEnabled)
    })
    cy.task('getJob')

    cy.visit('/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e/duplicate')

    const jobDuplicatePage = new JobDuplicatePage('Warehouse operator')

    jobDuplicatePage.employerIdLink().click()
    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
    jobRoleUpdatePage.headerCaption().contains('Update a job - step 1 of 6')

    jobRoleUpdatePage.employerIdField().clear().type('Tesco')
    jobRoleUpdatePage.employerIdFieldOption(0).click()
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.employerId().contains('Tesco')

    jobDuplicatePage.jobTitleLink().click()
    jobRoleUpdatePage.jobTitleField().clear().type('A different job')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.jobTitle().contains('A different job')

    jobDuplicatePage.sectorLink().click()
    jobRoleUpdatePage.sectorField().select('RETAIL')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.sector().contains('Retail and sales')

    jobDuplicatePage.industrySectorLink().click()
    jobRoleUpdatePage.industrySectorField().select('RETAIL')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.industrySector().contains('Retail (includes wholesale and motor vehicle repair)')

    jobDuplicatePage.numberOfVacanciesLink().click()
    jobRoleUpdatePage.numberOfVacanciesField().clear().type('2')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.numberOfVacancies().contains('2')

    jobDuplicatePage.sourcePrimaryLink().click()
    jobRoleUpdatePage.sourcePrimaryField().select('PRISON')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.sourcePrimary().contains('Prison')

    jobDuplicatePage.sourceSecondaryLink().click()
    jobRoleUpdatePage.sourceSecondaryField().select('NFN')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.sourceSecondary().contains('NFN')

    jobDuplicatePage.charityNameLink().click()
    jobRoleUpdatePage.charityNameField().clear().type('Another charity')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.charityName().contains('Another charity')

    // National job page changes
    jobDuplicatePage.isNationalLink().click()
    const jobIsNationalUpdatePage = new JobIsNationalUpdatePage('Is this a national job?')
    jobIsNationalUpdatePage.headerCaption().contains('Update a job - step 2 of 6')

    // Non-national to National
    jobIsNationalUpdatePage.isNationalFieldYes().click()
    jobIsNationalUpdatePage.submitButton().click()
    jobDuplicatePage.isNational().contains('Yes')

    // National to non-national
    jobDuplicatePage.isNationalLink().click()
    jobIsNationalUpdatePage.isNationalFieldNo().click()
    jobIsNationalUpdatePage.submitButton().click()
    // Should go to the contract page next, for the user to fill in postcode details
    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')
    jobContractUpdatePage.headerCaption().contains('Update a job - step 3 of 6')
    jobContractUpdatePage.postCodeField().clear().type('NE35 8DR')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.postCode().contains('NE35 8DR')
    jobDuplicatePage.isNational().contains('No')

    // Contract page changes
    jobDuplicatePage.postCodeLink().click()
    jobContractUpdatePage.postCodeField().clear().type('NE35 6DR')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.postCode().contains('NE35 6DR')

    jobDuplicatePage.salaryFromLink().click()
    jobContractUpdatePage.salaryFromField().clear().type('350.99')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.salaryFrom().contains('350.99')

    jobDuplicatePage.salaryToLink().click()
    jobContractUpdatePage.salaryToField().clear().type('450.99')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.salaryTo().contains('450.99')

    jobDuplicatePage.salaryPeriodLink().click()
    jobContractUpdatePage.salaryPeriodField().select('PER_DAY')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.salaryPeriod().contains('Per day')

    jobDuplicatePage.isPayingAtLeastNationalMinimumWageLink().click()
    jobContractUpdatePage.isPayingAtLeastNationalMinimumWageNo().click()
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.isPayingAtLeastNationalMinimumWage().contains('No')

    jobDuplicatePage.workPatternLink().click()
    jobContractUpdatePage.workPatternField().select('ANNUALISED_HOURS')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.workPattern().contains('Annualised hours')

    jobDuplicatePage.contractTypeLink().click()
    jobContractUpdatePage.contractTypeField().select('TEMPORARY')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.contractType().contains('Temporary')

    jobDuplicatePage.hoursPerWeekLink().click()
    jobContractUpdatePage.hoursPerWeekField().select('PART_TIME')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.hoursPerWeek().contains('Part-time (less than 30 hours)')

    jobDuplicatePage.additionalSalaryInformationLink().click()
    jobContractUpdatePage.additionalSalaryInformationField().clear().type('Some info')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.additionalSalaryInformation().contains('Some info')

    jobDuplicatePage.baseLocationLink().click()
    jobContractUpdatePage.baseLocationField().select('WORKPLACE')
    jobContractUpdatePage.submitButton().click()
    jobDuplicatePage.baseLocation().contains('Workplace')

    // Requirements page changes
    jobDuplicatePage.essentialCriteriaLink().click()
    const jobRequirementsUpdatePage = new JobRequirementsUpdatePage('Requirements and job description')
    jobContractUpdatePage.headerCaption().contains('Update a job - step 4 of 6')

    jobRequirementsUpdatePage.essentialCriteriaField().clear().type('Some essential text')
    jobRequirementsUpdatePage.submitButton().click()
    jobDuplicatePage.essentialCriteria().contains('Some essential text')

    jobDuplicatePage.desirableCriteriaLink().click()
    jobRequirementsUpdatePage.desirableCriteriaField().clear().type('Some desirable text')
    jobRequirementsUpdatePage.submitButton().click()
    jobDuplicatePage.desirableCriteria().contains('Some desirable text')

    jobDuplicatePage.descriptionLink().click()
    jobRequirementsUpdatePage.descriptionField().clear().type('Some descriptive text')
    jobRequirementsUpdatePage.submitButton().click()
    jobDuplicatePage.description().contains('Some descriptive text')

    jobDuplicatePage.offenceExclusionsLink().click()
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('MURDER').click()
    jobRequirementsUpdatePage.offenceExclusionsDetailsField().clear().type('Some text')
    jobRequirementsUpdatePage.submitButton().click()
    jobDuplicatePage.offenceExclusions().contains('Murder')
    jobDuplicatePage.offenceExclusions().contains('Other - Some text')

    // How to apply page changes
    jobDuplicatePage.closingDateLink().click()
    const jobHowToApplyPage = new JobHowToApplyPage('How to apply')
    jobHowToApplyPage.headerCaption().contains('Update a job - step 5 of 6')
    jobHowToApplyPage.closingDateField.day().clear().type('3')
    jobHowToApplyPage.closingDateField.month().clear().type('4')
    jobHowToApplyPage.closingDateField.year().clear().type('2027')
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.closingDate().contains('3 April 2027')

    jobDuplicatePage.isRollingOpportunityLink().click()
    jobHowToApplyPage.isRollingOpportunityFieldYes().click()
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.isRollingOpportunity().contains('Yes')

    jobDuplicatePage.startDateLink().click()
    jobHowToApplyPage.startDateField.day().clear().type('2')
    jobHowToApplyPage.startDateField.month().clear().type('3')
    jobHowToApplyPage.startDateField.year().clear().type('2027')
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.startDate().contains('2 March 2027')

    jobDuplicatePage.isOnlyForPrisonLeaversLink().click()
    jobHowToApplyPage.isOnlyForPrisonLeaversFieldNo().click()
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.isOnlyForPrisonLeavers().contains('No')

    jobDuplicatePage.howToApplyLink().click()
    jobHowToApplyPage.howToApplyField().clear().type('Some info to apply')
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.howToApply().contains('Some info to apply')

    jobDuplicatePage.supportingDocumentationRequiredLink().click()
    jobHowToApplyPage.supportingDocumentationRequiredFieldValue('DISCLOSURE_LETTER').click()
    jobHowToApplyPage.supportingDocumentationDetailsField().clear().type('Some more text')
    jobHowToApplyPage.submitButton().click()
    jobDuplicatePage.supportingDocumentationRequired().contains('Disclosure letter')
    jobDuplicatePage.supportingDocumentationRequired().contains('Some more text')
  })

  it('Duplicate job - cancel flow', () => {
    // Skip tests if broker iteration is not enabled
    cy.checkFeatureToggle('brokerIterationEnabled', isEnabled => {
      skipOn(!isEnabled)
    })
    // Skip this test if national jobs not enabled.
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      skipOn(!isEnabled)
    })
    cy.task('getJob')

    cy.visit('/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e')
    const jobReviewPage = new JobReviewPage('Warehouse operator')

    // Click the duplicate button
    jobReviewPage.duplicateJobButton().click()
    const jobDuplicatePage = new JobDuplicatePage('Warehouse operator')

    // Update the job details
    jobDuplicatePage.jobTitleLink().click()
    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
    jobRoleUpdatePage.headerCaption().contains('Update a job - step 1 of 6')

    jobRoleUpdatePage.jobTitleField().clear().type('A different job')
    jobRoleUpdatePage.submitButton().click()
    jobDuplicatePage.jobTitle().contains('A different job')

    // Cancel the duplication - return to the review page of the original job
    jobDuplicatePage.cancelButton().click()
    cy.url().should('include', '/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e')
    jobReviewPage.headerCaption().contains('Update a job - step 6 of 6')

    // Click 'Duplicate' button again - creates a fresh duplicate job, previous changes have been lost.
    jobReviewPage.duplicateJobButton().click()
    cy.url().should('include', '/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e/duplicate')
    jobDuplicatePage.jobTitle().contains('Warehouse operator')
  })
})
