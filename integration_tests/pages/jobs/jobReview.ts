import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobReviewPage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  // Values
  employerId = (): PageElement => cy.get('[data-qa=employerId]')

  jobTitle = (): PageElement => cy.get('[data-qa=jobTitle]')

  sector = (): PageElement => cy.get('[data-qa=sector]')

  industrySector = (): PageElement => cy.get('[data-qa=industrySector]')

  numberOfVacancies = (): PageElement => cy.get('[data-qa=numberOfVacancies]')

  sourcePrimary = (): PageElement => cy.get('[data-qa=sourcePrimary]')

  sourceSecondary = (): PageElement => cy.get('[data-qa=sourceSecondary]')

  charityName = (): PageElement => cy.get('[data-qa=charityName]')

  isNational = (): PageElement => cy.get('[data-qa=isNational]')

  postCode = (): PageElement => cy.get('[data-qa=postCode]')

  salaryFrom = (): PageElement => cy.get('[data-qa=salaryFrom]')

  salaryTo = (): PageElement => cy.get('[data-qa=salaryTo]')

  salaryPeriod = (): PageElement => cy.get('[data-qa=salaryPeriod]')

  additionalSalaryInformation = (): PageElement => cy.get('[data-qa=additionalSalaryInformation]')

  isPayingAtLeastNationalMinimumWage = (): PageElement => cy.get('[data-qa=isPayingAtLeastNationalMinimumWage]')

  workPattern = (): PageElement => cy.get('[data-qa=workPattern]')

  contractType = (): PageElement => cy.get('[data-qa=contractType]')

  hoursPerWeek = (): PageElement => cy.get('[data-qa=hoursPerWeek]')

  baseLocation = (): PageElement => cy.get('[data-qa=baseLocation]')

  essentialCriteria = (): PageElement => cy.get('[data-qa=essentialCriteria]')

  desirableCriteria = (): PageElement => cy.get('[data-qa=desirableCriteria]')

  description = (): PageElement => cy.get('[data-qa=description]')

  offenceExclusions = (): PageElement => cy.get('[data-qa=offenceExclusions]')

  howToApply = (): PageElement => cy.get('[data-qa=howToApply]')

  closingDate = (): PageElement => cy.get('[data-qa=closingDate]')

  startDate = (): PageElement => cy.get('[data-qa=startDate]')

  isRollingOpportunity = (): PageElement => cy.get('[data-qa=isRollingOpportunity]')

  isOnlyForPrisonLeavers = (): PageElement => cy.get('[data-qa=isOnlyForPrisonLeavers]')

  supportingDocumentationRequired = (): PageElement => cy.get('[data-qa=supportingDocumentationRequired]')

  supportingDocumentationDetails = (): PageElement => cy.get('[data-qa=supportingDocumentationDetails]')

  // Links
  employerIdLink = (): PageElement => cy.get('[data-qa=employerIdLink]')

  jobTitleLink = (): PageElement => cy.get('[data-qa=jobTitleLink]')

  sectorLink = (): PageElement => cy.get('[data-qa=sectorLink]')

  industrySectorLink = (): PageElement => cy.get('[data-qa=industrySectorLink]')

  numberOfVacanciesLink = (): PageElement => cy.get('[data-qa=numberOfVacanciesLink]')

  sourcePrimaryLink = (): PageElement => cy.get('[data-qa=sourcePrimaryLink]')

  sourceSecondaryLink = (): PageElement => cy.get('[data-qa=sourceSecondaryLink]')

  charityNameLink = (): PageElement => cy.get('[data-qa=charityNameLink]')

  postCodeLink = (): PageElement => cy.get('[data-qa=postCodeLink]')

  salaryFromLink = (): PageElement => cy.get('[data-qa=salaryFromLink]')

  salaryToLink = (): PageElement => cy.get('[data-qa=salaryToLink]')

  salaryPeriodLink = (): PageElement => cy.get('[data-qa=salaryPeriodLink]')

  additionalSalaryInformationLink = (): PageElement => cy.get('[data-qa=additionalSalaryInformationLink]')

  isPayingAtLeastNationalMinimumWageLink = (): PageElement => cy.get('[data-qa=isPayingAtLeastNationalMinimumWageLink]')

  workPatternLink = (): PageElement => cy.get('[data-qa=workPatternLink]')

  contractTypeLink = (): PageElement => cy.get('[data-qa=contractTypeLink]')

  hoursPerWeekLink = (): PageElement => cy.get('[data-qa=hoursPerWeekLink]')

  baseLocationLink = (): PageElement => cy.get('[data-qa=baseLocationLink]')

  essentialCriteriaLink = (): PageElement => cy.get('[data-qa=essentialCriteriaLink]')

  desirableCriteriaLink = (): PageElement => cy.get('[data-qa=desirableCriteriaLink]')

  descriptionLink = (): PageElement => cy.get('[data-qa=descriptionLink]')

  offenceExclusionsLink = (): PageElement => cy.get('[data-qa=offenceExclusionsLink]')

  howToApplyLink = (): PageElement => cy.get('[data-qa=howToApplyLink]')

  closingDateLink = (): PageElement => cy.get('[data-qa=closingDateLink]')

  startDateLink = (): PageElement => cy.get('[data-qa=startDateLink]')

  isRollingOpportunityLink = (): PageElement => cy.get('[data-qa=isRollingOpportunityLink]')

  isOnlyForPrisonLeaversLink = (): PageElement => cy.get('[data-qa=isOnlyForPrisonLeaversLink]')

  supportingDocumentationRequiredLink = (): PageElement => cy.get('[data-qa=supportingDocumentationRequiredLink]')

  supportingDocumentationDetailsLink = (): PageElement => cy.get('[data-qa=supportingDocumentationDetailsLink]')
}
