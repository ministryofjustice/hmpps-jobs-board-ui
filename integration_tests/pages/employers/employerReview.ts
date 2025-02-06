import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class EmployerReviewPage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  // Values
  employerName = (): PageElement => cy.get('[data-qa=employerName]')

  employerStatus = (): PageElement => cy.get('[data-qa=employerStatus]')

  employerSector = (): PageElement => cy.get('[data-qa=employerSector]')

  employerDescription = (): PageElement => cy.get('[data-qa=employerDescription]')

  // Links
  employerNameLink = (): PageElement => cy.get('[data-qa=employerNameLink]')

  employerStatusLink = (): PageElement => cy.get('[data-qa=employerStatusLink]')

  employerSectorLink = (): PageElement => cy.get('[data-qa=employerSectorLink]')

  employerDescriptionLink = (): PageElement => cy.get('[data-qa=employerDescriptionLink]')

  // Errors
  pageErrorMessages = (): PageElement => cy.get('[data-module=govuk-error-summary]')
}
