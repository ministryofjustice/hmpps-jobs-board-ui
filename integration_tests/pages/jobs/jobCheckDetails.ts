import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobCheckDetailsPage extends Page {
  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')
}
