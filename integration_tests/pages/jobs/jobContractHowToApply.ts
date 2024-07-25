import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobHowToApplyPage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  howToApplyField = (): PageElement => cy.get('#howToApply')

  howToApplyPageErrorMessage = (): PageElement => cy.get('[href="#howToApply"]')

  howToApplyFieldErrorMessage = (): PageElement => cy.get('#howToApply-error')

  supportingDocumentationRequiredField = (): PageElement => cy.get('#supportingDocumentationRequired')

  supportingDocumentationRequiredFieldValue = (value): PageElement =>
    cy.get(`input[name="supportingDocumentationRequired"][value="${value}"]`)

  supportingDocumentationRequiredPageErrorMessage = (): PageElement =>
    cy.get('[href="#supportingDocumentationRequired"]')

  supportingDocumentationRequiredFieldErrorMessage = (): PageElement => cy.get('#supportingDocumentationRequired-error')

  supportingDocumentationDetailsField = (): PageElement => cy.get('#supportingDocumentationDetails')

  supportingDocumentationDetailsPageErrorMessage = (): PageElement => cy.get('[href="#supportingDocumentationDetails"]')

  supportingDocumentationDetailsFieldErrorMessage = (): PageElement => cy.get('#supportingDocumentationDetails-error')

  isRollingOpportunityField = (): PageElement => cy.get('#isRollingOpportunity')

  isRollingOpportunityPageErrorMessage = (): PageElement => cy.get('[href="#isRollingOpportunity"]')

  isRollingOpportunityFieldErrorMessage = (): PageElement => cy.get('#isRollingOpportunity-error')

  isRollingOpportunityFieldYes = (): PageElement => cy.get('input[name="isRollingOpportunity"][value="YES"]')

  isRollingOpportunityFieldNo = (): PageElement => cy.get('input[name="isRollingOpportunity"][value="NO"]')

  isOnlyForPrisonLeaversField = (): PageElement => cy.get('#isOnlyForPrisonLeavers')

  isOnlyForPrisonLeaversPageErrorMessage = (): PageElement => cy.get('[href="#isOnlyForPrisonLeavers"]')

  isOnlyForPrisonLeaversFieldErrorMessage = (): PageElement => cy.get('#isOnlyForPrisonLeavers-error')

  isOnlyForPrisonLeaversFieldYes = (): PageElement => cy.get('input[name="isOnlyForPrisonLeavers"][value="YES"]')

  isOnlyForPrisonLeaversFieldNo = (): PageElement => cy.get('input[name="isOnlyForPrisonLeavers"][value="NO"]')

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
