import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobContractHowToApplyPage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  howToApplyField = (): PageElement => cy.get('#howToApply')

  howToApplyPageErrorMessage = (): PageElement => cy.get('[href="#howToApply"]')

  howToApplyFieldErrorMessage = (): PageElement => cy.get('#howToApply-error')

  supportingDocumentationField = (): PageElement => cy.get('#supportingDocumentation')

  supportingDocumentationFieldValue = (value): PageElement =>
    cy.get(`input[name="supportingDocumentation"][value="${value}"]`)

  supportingDocumentationPageErrorMessage = (): PageElement => cy.get('[href="#supportingDocumentation"]')

  supportingDocumentationFieldErrorMessage = (): PageElement => cy.get('#supportingDocumentation-error')

  supportingDocumentationDetailsField = (): PageElement => cy.get('#supportingDocumentationDetails')

  supportingDocumentationDetailsPageErrorMessage = (): PageElement => cy.get('[href="#supportingDocumentationDetails"]')

  supportingDocumentationDetailsFieldErrorMessage = (): PageElement => cy.get('#supportingDocumentationDetails-error')

  rollingOpportunityField = (): PageElement => cy.get('#rollingOpportunity')

  rollingOpportunityPageErrorMessage = (): PageElement => cy.get('[href="#rollingOpportunity"]')

  rollingOpportunityFieldErrorMessage = (): PageElement => cy.get('#rollingOpportunity-error')

  rollingOpportunityFieldYes = (): PageElement => cy.get('input[name="rollingOpportunity"][value="YES"]')

  rollingOpportunityFieldNo = (): PageElement => cy.get('input[name="rollingOpportunity"][value="NO"]')

  prisonLeaversJobField = (): PageElement => cy.get('#prisonLeaversJob')

  prisonLeaversJobPageErrorMessage = (): PageElement => cy.get('[href="#prisonLeaversJob"]')

  prisonLeaversJobFieldErrorMessage = (): PageElement => cy.get('#prisonLeaversJob-error')

  prisonLeaversJobFieldYes = (): PageElement => cy.get('input[name="prisonLeaversJob"][value="YES"]')

  prisonLeaversJobFieldNo = (): PageElement => cy.get('input[name="prisonLeaversJob"][value="NO"]')

  startDateField = {
    day: (): PageElement => cy.get('#startDate-day'),
    month: (): PageElement => cy.get('#startDate-month'),
    year: (): PageElement => cy.get('#startDate-year'),
  }

  startDatePageErrorMessage = (): PageElement => cy.get('[href="#startDate"]')

  startDateFieldErrorMessage = (): PageElement => cy.get('#startDate-error')

  closingDateField = {
    day: (): PageElement => cy.get('#closingDate-day'),
    month: (): PageElement => cy.get('#closingDate-month'),
    year: (): PageElement => cy.get('#closingDate-year'),
  }

  closingDatePageErrorMessage = (): PageElement => cy.get('[href="#closingDate"]')

  closingDateFieldErrorMessage = (): PageElement => cy.get('#closingDate-error')
}
