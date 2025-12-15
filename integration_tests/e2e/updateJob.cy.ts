/* eslint-disable @typescript-eslint/no-unused-vars */
import { skipOn } from '@cypress/skip-test'
import JobHowToApplyPage from '../pages/jobs/jobContractHowToApply'
import JobContractUpdatePage from '../pages/jobs/jobContractUpdate'
import JobRequirementsUpdatePage from '../pages/jobs/jobRequirementsUpdate'
import JobReviewPage from '../pages/jobs/jobReview'
import JobRoleUpdatePage from '../pages/jobs/jobRoleUpdate'
import JobIsNationalUpdatePage from '../pages/jobs/jobIsNationalUpdate'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('putJob')
    cy.task('getEmployers', { page: 1 })
    cy.task('getJobs', { page: 1 })
    cy.signIn()
  })

  it('Update job flow - check loaded content - non-national job', () => {
    cy.task('getJob')
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      cy.wrap(isEnabled).as('nationalJobsEnabled')
    })

    cy.visit('/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e')

    const jobReviewPage = new JobReviewPage('Warehouse operator')

    cy.get('@nationalJobsEnabled').then(isEnabled => {
      if (isEnabled) {
        jobReviewPage.headerCaption().contains('Update a job - step 6 of 6')
      } else {
        jobReviewPage.headerCaption().contains('Update a job - step 5 of 5')
      }
    })

    jobReviewPage.employerId().contains('ASDA')
    jobReviewPage.jobTitle().contains('Warehouse operator')
    jobReviewPage.sector().contains('Warehousing and storage')
    jobReviewPage.industrySector().contains('Administration and support services')
    jobReviewPage.numberOfVacancies().contains('1')
    jobReviewPage.sourcePrimary().contains('NFN')
    jobReviewPage.sourceSecondary().contains('PEL')
    jobReviewPage.charityName().contains('Heart foundation')
    jobReviewPage.postCode().contains('NE236DR')

    // Expect national job field iff feature enabled
    cy.get('@nationalJobsEnabled').then(isEnabled => {
      if (isEnabled) {
        jobReviewPage.isNational().contains('No')
      }
    })

    jobReviewPage.salaryFrom().contains('£25000.00')
    jobReviewPage.salaryTo().contains('£30000.00')
    jobReviewPage.salaryPeriod().contains('Per year')
    jobReviewPage.additionalSalaryInformation().contains('10% Performance bonus')
    jobReviewPage.isPayingAtLeastNationalMinimumWage().contains('Yes')
    jobReviewPage.workPattern().contains('Flexi-time')
    jobReviewPage.contractType().contains('Permanent')
    jobReviewPage.hoursPerWeek().contains('Full-time (more than 40 hours)')
    jobReviewPage.baseLocation().contains('Workplace')
    jobReviewPage.essentialCriteria().contains('Some essential criteria')
    jobReviewPage.desirableCriteria().contains('Some desirable criteria')
    jobReviewPage.description().contains('Some job description')
    jobReviewPage.offenceExclusions().contains('Arson')
    jobReviewPage.offenceExclusions().contains('Terrorism')
    jobReviewPage.offenceExclusions().contains('Arson')
    jobReviewPage.offenceExclusions().contains('Other - Some details')
    jobReviewPage.isRollingOpportunity().contains('No')
    jobReviewPage.closingDate().contains('1 February 2025')
    jobReviewPage.isOnlyForPrisonLeavers().contains('Yes')
    jobReviewPage.startDate().contains('1 June 2025')
    jobReviewPage.howToApply().contains('Some apply details')
    jobReviewPage.supportingDocumentationRequired().contains('CV')
    jobReviewPage.supportingDocumentationRequired().contains('Other - Covering letter')

    jobReviewPage.submitButton().click()
  })

  it('Update job flow - check loaded content - national job', () => {
    // Skip this test if national jobs is not enabled
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      skipOn(!isEnabled)
    })

    cy.task('getNationalJob')

    cy.visit('/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e')

    const jobReviewPage = new JobReviewPage('National Warehouse operator')
    jobReviewPage.headerCaption().contains('Update a job - step 6 of 6')

    jobReviewPage.employerId().contains('ASDA')
    jobReviewPage.jobTitle().contains('Warehouse operator')
    jobReviewPage.sector().contains('Warehousing and storage')
    jobReviewPage.industrySector().contains('Administration and support services')
    jobReviewPage.numberOfVacancies().contains('1')
    jobReviewPage.sourcePrimary().contains('NFN')
    jobReviewPage.sourceSecondary().contains('PEL')
    jobReviewPage.charityName().contains('Heart foundation')
    jobReviewPage.isNational().contains('Yes')
    jobReviewPage.salaryFrom().contains('£25000.00')
    jobReviewPage.salaryTo().contains('£30000.00')
    jobReviewPage.salaryPeriod().contains('Per year')
    jobReviewPage.additionalSalaryInformation().contains('10% Performance bonus')
    jobReviewPage.isPayingAtLeastNationalMinimumWage().contains('Yes')
    jobReviewPage.workPattern().contains('Flexi-time')
    jobReviewPage.contractType().contains('Permanent')
    jobReviewPage.hoursPerWeek().contains('Full-time (more than 40 hours)')
    jobReviewPage.baseLocation().contains('Workplace')
    jobReviewPage.essentialCriteria().contains('Some essential criteria')
    jobReviewPage.desirableCriteria().contains('Some desirable criteria')
    jobReviewPage.description().contains('Some job description')
    jobReviewPage.offenceExclusions().contains('Arson')
    jobReviewPage.offenceExclusions().contains('Terrorism')
    jobReviewPage.offenceExclusions().contains('Arson')
    jobReviewPage.offenceExclusions().contains('Other - Some details')
    jobReviewPage.isRollingOpportunity().contains('No')
    jobReviewPage.closingDate().contains('1 February 2025')
    jobReviewPage.isOnlyForPrisonLeavers().contains('Yes')
    jobReviewPage.startDate().contains('1 June 2025')
    jobReviewPage.howToApply().contains('Some apply details')
    jobReviewPage.supportingDocumentationRequired().contains('CV')
    jobReviewPage.supportingDocumentationRequired().contains('Other - Covering letter')

    jobReviewPage.submitButton().click()
  })

  it('Update job - change links flow - without national jobs', () => {
    // Skip this test if national jobs enabled.
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      skipOn(isEnabled)
    })

    cy.task('getJob')

    cy.visit('/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e')

    const jobReviewPage = new JobReviewPage('Warehouse operator')
    jobReviewPage.headerCaption().contains('Update a job - step 5 of 5')

    jobReviewPage.employerIdLink().click()
    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
    jobRoleUpdatePage.headerCaption().contains('Update a job - step 1 of 5')

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
    jobRoleUpdatePage.sourceSecondaryField().select('NFN')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.sourceSecondary().contains('NFN')

    jobReviewPage.charityNameLink().click()
    jobRoleUpdatePage.charityNameField().clear().type('Another charity')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.charityName().contains('Another charity')

    // Contract page changes
    jobReviewPage.postCodeLink().click()
    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')
    jobContractUpdatePage.headerCaption().contains('Update a job - step 2 of 5')

    jobContractUpdatePage.postCodeField().clear().type('NE35 6DR')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.postCode().contains('NE35 6DR')

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
    const jobRequirementsUpdatePage = new JobRequirementsUpdatePage('Requirements and job description')
    jobContractUpdatePage.headerCaption().contains('Update a job - step 3 of 5')

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
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('MURDER').click()
    jobRequirementsUpdatePage.offenceExclusionsDetailsField().clear().type('Some text')
    jobRequirementsUpdatePage.submitButton().click()
    jobReviewPage.offenceExclusions().contains('Murder')
    jobReviewPage.offenceExclusions().contains('Other - Some text')

    // How to apply page changes
    jobReviewPage.closingDateLink().click()
    const jobHowToApplyPage = new JobHowToApplyPage('How to apply')
    jobHowToApplyPage.headerCaption().contains('Update a job - step 4 of 5')

    jobHowToApplyPage.closingDateField.day().clear().type('3')
    jobHowToApplyPage.closingDateField.month().clear().type('4')
    jobHowToApplyPage.closingDateField.year().clear().type('2027')
    jobHowToApplyPage.submitButton().click()
    jobReviewPage.closingDate().contains('3 April 2027')

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
    jobHowToApplyPage.supportingDocumentationRequiredFieldValue('DISCLOSURE_LETTER').click()
    jobHowToApplyPage.supportingDocumentationDetailsField().clear().type('Some more text')
    jobHowToApplyPage.submitButton().click()
    jobReviewPage.supportingDocumentationRequired().contains('Disclosure letter')
    jobReviewPage.supportingDocumentationRequired().contains('Some more text')
  })

  it('Update job - change links flow - with national jobs', () => {
    // Skip this test if national jobs not enabled.
    cy.checkFeatureToggle('nationalJobs', isEnabled => {
      skipOn(!isEnabled)
    })
    cy.task('getJob')

    cy.visit('/jobs/job/0190a227-be75-7009-8ad6-c6b068b6754e')

    const jobReviewPage = new JobReviewPage('Warehouse operator')
    jobReviewPage.headerCaption().contains('Update a job - step 6 of 6')

    jobReviewPage.employerIdLink().click()
    const jobRoleUpdatePage = new JobRoleUpdatePage('Job role and source')
    jobRoleUpdatePage.headerCaption().contains('Update a job - step 1 of 6')

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
    jobRoleUpdatePage.sourceSecondaryField().select('NFN')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.sourceSecondary().contains('NFN')

    jobReviewPage.charityNameLink().click()
    jobRoleUpdatePage.charityNameField().clear().type('Another charity')
    jobRoleUpdatePage.submitButton().click()
    jobReviewPage.charityName().contains('Another charity')

    // National job page changes
    jobReviewPage.isNationalLink().click()
    const jobIsNationalUpdatePage = new JobIsNationalUpdatePage('Is this a national job?')
    jobIsNationalUpdatePage.headerCaption().contains('Update a job - step 2 of 6')

    // Non-national to National
    jobIsNationalUpdatePage.isNationalFieldYes().click()
    jobIsNationalUpdatePage.submitButton().click()
    jobReviewPage.isNational().contains('Yes')

    // National to non-national
    jobReviewPage.isNationalLink().click()
    jobIsNationalUpdatePage.isNationalFieldNo().click()
    jobIsNationalUpdatePage.submitButton().click()
    // Should go to the contract page next, for the user to fill in postcode details
    const jobContractUpdatePage = new JobContractUpdatePage('Job location and contract')
    jobContractUpdatePage.headerCaption().contains('Update a job - step 3 of 6')
    jobContractUpdatePage.postCodeField().clear().type('NE35 8DR')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.postCode().contains('NE35 8DR')
    jobReviewPage.isNational().contains('No')

    // Contract page changes
    jobReviewPage.postCodeLink().click()
    jobContractUpdatePage.postCodeField().clear().type('NE35 6DR')
    jobContractUpdatePage.submitButton().click()
    jobReviewPage.postCode().contains('NE35 6DR')

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
    const jobRequirementsUpdatePage = new JobRequirementsUpdatePage('Requirements and job description')
    jobContractUpdatePage.headerCaption().contains('Update a job - step 4 of 6')

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
    jobRequirementsUpdatePage.offenceExclusionsFieldValue('MURDER').click()
    jobRequirementsUpdatePage.offenceExclusionsDetailsField().clear().type('Some text')
    jobRequirementsUpdatePage.submitButton().click()
    jobReviewPage.offenceExclusions().contains('Murder')
    jobReviewPage.offenceExclusions().contains('Other - Some text')

    // How to apply page changes
    jobReviewPage.closingDateLink().click()
    const jobHowToApplyPage = new JobHowToApplyPage('How to apply')
    jobHowToApplyPage.headerCaption().contains('Update a job - step 5 of 6')

    jobHowToApplyPage.closingDateField.day().clear().type('3')
    jobHowToApplyPage.closingDateField.month().clear().type('4')
    jobHowToApplyPage.closingDateField.year().clear().type('2027')
    jobHowToApplyPage.submitButton().click()
    jobReviewPage.closingDate().contains('3 April 2027')

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
    jobHowToApplyPage.supportingDocumentationRequiredFieldValue('DISCLOSURE_LETTER').click()
    jobHowToApplyPage.supportingDocumentationDetailsField().clear().type('Some more text')
    jobHowToApplyPage.submitButton().click()
    jobReviewPage.supportingDocumentationRequired().contains('Disclosure letter')
    jobReviewPage.supportingDocumentationRequired().contains('Some more text')
  })
})
