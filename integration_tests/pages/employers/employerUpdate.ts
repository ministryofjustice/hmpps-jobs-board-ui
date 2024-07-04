import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class EmployerUpdatePage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  employerNameField = (): PageElement => cy.get('#employerName')

  employerStatusField = (): PageElement => cy.get('#employerStatus')

  employerSectorField = (): PageElement => cy.get('#employerSector')

  employerDescriptionField = (): PageElement => cy.get('#employerDescription')

  employerNamePageErrorMessage = (): PageElement => cy.get('[href="#employerName"]')

  employerStatusPageErrorMessage = (): PageElement => cy.get('[href="#employerStatus"]')

  employerSectorPageErrorMessage = (): PageElement => cy.get('[href="#employerSector"]')

  employerDescriptionPageErrorMessage = (): PageElement => cy.get('[href="#employerDescription"]')

  employerNameFieldErrorMessage = (): PageElement => cy.get('#employerName-error')

  employerStatusFieldErrorMessage = (): PageElement => cy.get('#employerStatus-error')

  employerSectorFieldErrorMessage = (): PageElement => cy.get('#employerSector-error')

  employerDescriptionFieldErrorMessage = (): PageElement => cy.get('#employerDescription-error')
}
