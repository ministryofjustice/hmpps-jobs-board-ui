import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobReviewPage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  // Values
  employerId = (): PageElement => cy.get('[data-qa=employerId]')

  jobTitle = (): PageElement => cy.get('[data-qa=jobTitle]')

  jobSector = (): PageElement => cy.get('[data-qa=jobSector]')

  industrySector = (): PageElement => cy.get('[data-qa=industrySector]')

  numberOfVacancies = (): PageElement => cy.get('[data-qa=numberOfVacancies]')

  jobSourceOne = (): PageElement => cy.get('[data-qa=jobSourceOne]')

  jobSourceTwo = (): PageElement => cy.get('[data-qa=jobSourceTwo]')

  charity = (): PageElement => cy.get('[data-qa=charity]')

  postcode = (): PageElement => cy.get('[data-qa=postcode]')

  salaryFrom = (): PageElement => cy.get('[data-qa=salaryFrom]')

  salaryTo = (): PageElement => cy.get('[data-qa=salaryTo]')

  salaryPeriod = (): PageElement => cy.get('[data-qa=salaryPeriod]')

  additionalSalaryInformation = (): PageElement => cy.get('[data-qa=additionalSalaryInformation]')

  nationalMinimumWage = (): PageElement => cy.get('[data-qa=nationalMinimumWage]')

  workPattern = (): PageElement => cy.get('[data-qa=workPattern]')

  contractType = (): PageElement => cy.get('[data-qa=contractType]')

  hours = (): PageElement => cy.get('[data-qa=hours]')

  baseLocation = (): PageElement => cy.get('[data-qa=baseLocation]')

  essentialCriteria = (): PageElement => cy.get('[data-qa=essentialCriteria]')

  desirableCriteria = (): PageElement => cy.get('[data-qa=desirableCriteria]')

  jobDescription = (): PageElement => cy.get('[data-qa=jobDescription]')

  offenceExclusions = (): PageElement => cy.get('[data-qa=offenceExclusions]')

  howToApply = (): PageElement => cy.get('[data-qa=howToApply]')

  closingDate = (): PageElement => cy.get('[data-qa=closingDate]')

  startDate = (): PageElement => cy.get('[data-qa=startDate]')

  rollingOpportunity = (): PageElement => cy.get('[data-qa=rollingOpportunity]')

  prisonLeaversJob = (): PageElement => cy.get('[data-qa=prisonLeaversJob]')

  supportingDocumentation = (): PageElement => cy.get('[data-qa=supportingDocumentation]')

  supportingDocumentationDetails = (): PageElement => cy.get('[data-qa=supportingDocumentationDetails]')

  // Links
  employerIdLink = (): PageElement => cy.get('[data-qa=employerIdLink]')

  jobTitleLink = (): PageElement => cy.get('[data-qa=jobTitleLink]')

  jobSectorLink = (): PageElement => cy.get('[data-qa=jobSectorLink]')

  industrySectorLink = (): PageElement => cy.get('[data-qa=industrySectorLink]')

  numberOfVacanciesLink = (): PageElement => cy.get('[data-qa=numberOfVacanciesLink]')

  jobSourceOneLink = (): PageElement => cy.get('[data-qa=jobSourceOneLink]')

  jobSourceTwoLink = (): PageElement => cy.get('[data-qa=jobSourceTwoLink]')

  charityLink = (): PageElement => cy.get('[data-qa=charityLink]')

  postcodeLink = (): PageElement => cy.get('[data-qa=postcodeLink]')

  salaryFromLink = (): PageElement => cy.get('[data-qa=salaryFromLink]')

  salaryToLink = (): PageElement => cy.get('[data-qa=salaryToLink]')

  salaryPeriodLink = (): PageElement => cy.get('[data-qa=salaryPeriodLink]')

  additionalSalaryInformationLink = (): PageElement => cy.get('[data-qa=additionalSalaryInformationLink]')

  nationalMinimumWageLink = (): PageElement => cy.get('[data-qa=nationalMinimumWageLink]')

  workPatternLink = (): PageElement => cy.get('[data-qa=workPatternLink]')

  contractTypeLink = (): PageElement => cy.get('[data-qa=contractTypeLink]')

  hoursLink = (): PageElement => cy.get('[data-qa=hoursLink]')

  baseLocationLink = (): PageElement => cy.get('[data-qa=baseLocationLink]')

  essentialCriteriaLink = (): PageElement => cy.get('[data-qa=essentialCriteriaLink]')

  desirableCriteriaLink = (): PageElement => cy.get('[data-qa=desirableCriteriaLink]')

  jobDescriptionLink = (): PageElement => cy.get('[data-qa=jobDescriptionLink]')

  offenceExclusionsLink = (): PageElement => cy.get('[data-qa=offenceExclusionsLink]')

  howToApplyLink = (): PageElement => cy.get('[data-qa=howToApplyLink]')

  closingDateLink = (): PageElement => cy.get('[data-qa=closingDateLink]')

  startDateLink = (): PageElement => cy.get('[data-qa=startDateLink]')

  rollingOpportunityLink = (): PageElement => cy.get('[data-qa=rollingOpportunityLink]')

  prisonLeaversJobLink = (): PageElement => cy.get('[data-qa=prisonLeaversJobLink]')

  supportingDocumentationLink = (): PageElement => cy.get('[data-qa=supportingDocumentationLink]')

  supportingDocumentationDetailsLink = (): PageElement => cy.get('[data-qa=supportingDocumentationDetailsLink]')
}
