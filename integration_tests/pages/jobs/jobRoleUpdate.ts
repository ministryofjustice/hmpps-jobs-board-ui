import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobRoleUpdatePage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  employerIdField = (): PageElement => cy.get('#employerId')

  employerIdFieldOption = (id: number): PageElement => cy.get(`#employerId__option--${id}`)

  employerIdPageErrorMessage = (): PageElement => cy.get('[href="#employerId"]')

  employerIdFieldErrorMessage = (): PageElement => cy.get('#employerId-error')

  jobTitleField = (): PageElement => cy.get('#jobTitle')

  jobTitlePageErrorMessage = (): PageElement => cy.get('[href="#jobTitle"]')

  jobTitleFieldErrorMessage = (): PageElement => cy.get('#jobTitle-error')

  sectorField = (): PageElement => cy.get('#sector')

  sectorPageErrorMessage = (): PageElement => cy.get('[href="#sector"]')

  sectorFieldErrorMessage = (): PageElement => cy.get('#sector-error')

  industrySectorField = (): PageElement => cy.get('#industrySector')

  industrySectorPageErrorMessage = (): PageElement => cy.get('[href="#industrySector"]')

  industrySectorFieldErrorMessage = (): PageElement => cy.get('#industrySector-error')

  numberOfVacanciesField = (): PageElement => cy.get('#numberOfVacancies')

  numberOfVacanciesPageErrorMessage = (): PageElement => cy.get('[href="#numberOfVacancies"]')

  numberOfVacanciesFieldErrorMessage = (): PageElement => cy.get('#numberOfVacancies-error')

  sourcePrimaryField = (): PageElement => cy.get('#sourcePrimary')

  sourcePrimaryPageErrorMessage = (): PageElement => cy.get('[href="#sourcePrimary"]')

  sourcePrimaryFieldErrorMessage = (): PageElement => cy.get('#sourcePrimary-error')

  sourceSecondaryField = (): PageElement => cy.get('#sourceSecondary')

  sourceSecondaryPageErrorMessage = (): PageElement => cy.get('[href="#sourceSecondary"]')

  sourceSecondaryFieldErrorMessage = (): PageElement => cy.get('#sourceSecondary-error')

  charityNameField = (): PageElement => cy.get('#charityName')

  charityNamePageErrorMessage = (): PageElement => cy.get('[href="#charityName"]')

  charityNameFieldErrorMessage = (): PageElement => cy.get('#charityName-error')
}
