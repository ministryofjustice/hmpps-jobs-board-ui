import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobRequirementsUpdatePage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  essentialCriteriaField = (): PageElement => cy.get('#essentialCriteria')

  essentialCriteriaPageErrorMessage = (): PageElement => cy.get('[href="#essentialCriteria"]')

  essentialCriteriaFieldErrorMessage = (): PageElement => cy.get('#essentialCriteria-error')

  desirableCriteriaField = (): PageElement => cy.get('#desirableCriteria')

  desirableCriteriaPageErrorMessage = (): PageElement => cy.get('[href="#desirableCriteria"]')

  desirableCriteriaFieldErrorMessage = (): PageElement => cy.get('#desirableCriteria-error')

  descriptionField = (): PageElement => cy.get('#description')

  descriptionPageErrorMessage = (): PageElement => cy.get('[href="#description"]')

  descriptionFieldErrorMessage = (): PageElement => cy.get('#description-error')

  offenceExclusionsField = (): PageElement => cy.get('#offenceExclusions')

  offenceExclusionsPageErrorMessage = (): PageElement => cy.get('[href="#offenceExclusions"]')

  offenceExclusionsFieldErrorMessage = (): PageElement => cy.get('#offenceExclusions-error')

  offenceExclusionsFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  offenceExclusionsDetailsField = (): PageElement => cy.get('#offenceExclusionsDetails')

  offenceExclusionsDetailsPageErrorMessage = (): PageElement => cy.get('[href="#offenceExclusionsDetails"]')

  offenceExclusionsDetailsFieldErrorMessage = (): PageElement => cy.get('#offenceExclusionsDetails-error')
}
