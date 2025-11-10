import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobIsNationalUpdatePage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  isNationalFieldYes = (): PageElement => cy.get('input[name="isNational"][value="YES"]')

  isNationalFieldNo = (): PageElement => cy.get('input[name="isNational"][value="NO"]')

  isNationalPageErrorMessage = (): PageElement => cy.get('[href="#isNational"]')

  isNationalFieldErrorMessage = (): PageElement => cy.get('#isNational-error')
}
