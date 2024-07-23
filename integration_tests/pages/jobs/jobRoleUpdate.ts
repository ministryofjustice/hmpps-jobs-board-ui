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

  jobSectorField = (): PageElement => cy.get('#jobSector')

  jobSectorPageErrorMessage = (): PageElement => cy.get('[href="#jobSector"]')

  jobSectorFieldErrorMessage = (): PageElement => cy.get('#jobSector-error')

  industrySectorField = (): PageElement => cy.get('#industrySector')

  industrySectorPageErrorMessage = (): PageElement => cy.get('[href="#industrySector"]')

  industrySectorFieldErrorMessage = (): PageElement => cy.get('#industrySector-error')

  numberOfVacanciesField = (): PageElement => cy.get('#numberOfVacancies')

  numberOfVacanciesPageErrorMessage = (): PageElement => cy.get('[href="#numberOfVacancies"]')

  numberOfVacanciesFieldErrorMessage = (): PageElement => cy.get('#numberOfVacancies-error')

  jobSourceOneField = (): PageElement => cy.get('#jobSourceOne')

  jobSourceOnePageErrorMessage = (): PageElement => cy.get('[href="#jobSourceOne"]')

  jobSourceOneFieldErrorMessage = (): PageElement => cy.get('#jobSourceOne-error')

  jobSourceTwoField = (): PageElement => cy.get('#jobSourceTwo')

  jobSourceTwoPageErrorMessage = (): PageElement => cy.get('[href="#jobSourceTwo"]')

  jobSourceTwoFieldErrorMessage = (): PageElement => cy.get('#jobSourceTwo-error')

  charityField = (): PageElement => cy.get('#charity')

  charityPageErrorMessage = (): PageElement => cy.get('[href="#charity"]')

  charityFieldErrorMessage = (): PageElement => cy.get('#charity-error')
}
