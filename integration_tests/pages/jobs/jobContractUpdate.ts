import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobContractUpdatePage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  postCodeField = (): PageElement => cy.get('#postCode')

  postCodePageErrorMessage = (): PageElement => cy.get('[href="#postCode"]')

  postCodeFieldErrorMessage = (): PageElement => cy.get('#postCode-error')

  salaryFromField = (): PageElement => cy.get('#salaryFrom')

  salaryFromPageErrorMessage = (): PageElement => cy.get('[href="#salaryFrom"]')

  salaryFromFieldErrorMessage = (): PageElement => cy.get('#salaryFrom-error')

  salaryToField = (): PageElement => cy.get('#salaryTo')

  salaryToPageErrorMessage = (): PageElement => cy.get('[href="#salaryTo"]')

  salaryToFieldErrorMessage = (): PageElement => cy.get('#salaryTo-error')

  salaryPeriodField = (): PageElement => cy.get('#salaryPeriod')

  salaryPeriodPageErrorMessage = (): PageElement => cy.get('[href="#salaryPeriod"]')

  salaryPeriodFieldErrorMessage = (): PageElement => cy.get('#salaryPeriod-error')

  additionalSalaryInformationField = (): PageElement => cy.get('#additionalSalaryInformation')

  additionalSalaryInformationPageErrorMessage = (): PageElement => cy.get('[href="#additionalSalaryInformation"]')

  additionalSalaryInformationFieldErrorMessage = (): PageElement => cy.get('#additionalSalaryInformation-error')

  isPayingAtLeastNationalMinimumWageField = (): PageElement => cy.get('#isPayingAtLeastNationalMinimumWage')

  isPayingAtLeastNationalMinimumWagePageErrorMessage = (): PageElement =>
    cy.get('[href="#isPayingAtLeastNationalMinimumWage"]')

  isPayingAtLeastNationalMinimumWageFieldErrorMessage = (): PageElement =>
    cy.get('#isPayingAtLeastNationalMinimumWage-error')

  isPayingAtLeastNationalMinimumWageYes = (): PageElement =>
    cy.get('input[name="isPayingAtLeastNationalMinimumWage"][value="YES"]')

  isPayingAtLeastNationalMinimumWageNo = (): PageElement =>
    cy.get('input[name="isPayingAtLeastNationalMinimumWage"][value="NO"]')

  workPatternField = (): PageElement => cy.get('#workPattern')

  workPatternPageErrorMessage = (): PageElement => cy.get('[href="#workPattern"]')

  workPatternFieldErrorMessage = (): PageElement => cy.get('#workPattern-error')

  contractTypeField = (): PageElement => cy.get('#contractType')

  contractTypePageErrorMessage = (): PageElement => cy.get('[href="#contractType"]')

  contractTypeFieldErrorMessage = (): PageElement => cy.get('#contractType-error')

  hoursPerWeekField = (): PageElement => cy.get('#hoursPerWeek')

  hoursPerWeekPageErrorMessage = (): PageElement => cy.get('[href="#hoursPerWeek"]')

  hoursPerWeekFieldErrorMessage = (): PageElement => cy.get('#hoursPerWeek-error')

  baseLocationField = (): PageElement => cy.get('#baseLocation')

  baseLocationPageErrorMessage = (): PageElement => cy.get('[href="#baseLocation"]')

  baseLocationFieldErrorMessage = (): PageElement => cy.get('#baseLocation-error')
}
