import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobContractUpdatePage extends Page {
  headerCaption = (): PageElement => cy.get('[data-qa=headerCaption]')

  postcodeField = (): PageElement => cy.get('#postcode')

  postcodePageErrorMessage = (): PageElement => cy.get('[href="#postcode"]')

  postcodeFieldErrorMessage = (): PageElement => cy.get('#postcode-error')

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

  nationalMinimumWageField = (): PageElement => cy.get('#nationalMinimumWage')

  nationalMinimumWagePageErrorMessage = (): PageElement => cy.get('[href="#nationalMinimumWage"]')

  nationalMinimumWageFieldErrorMessage = (): PageElement => cy.get('#nationalMinimumWage-error')

  nationalMinimumWageYes = (): PageElement => cy.get('[value=YES]')

  nationalMinimumWageNo = (): PageElement => cy.get('[value=NO]')

  workPatternField = (): PageElement => cy.get('#workPattern')

  workPatternPageErrorMessage = (): PageElement => cy.get('[href="#workPattern"]')

  workPatternFieldErrorMessage = (): PageElement => cy.get('#workPattern-error')

  contractTypeField = (): PageElement => cy.get('#contractType')

  contractTypePageErrorMessage = (): PageElement => cy.get('[href="#contractType"]')

  contractTypeFieldErrorMessage = (): PageElement => cy.get('#contractType-error')

  hoursField = (): PageElement => cy.get('#hours')

  hoursPageErrorMessage = (): PageElement => cy.get('[href="#hours"]')

  hoursFieldErrorMessage = (): PageElement => cy.get('#hours-error')

  baseLocationField = (): PageElement => cy.get('#baseLocation')

  baseLocationPageErrorMessage = (): PageElement => cy.get('[href="#baseLocation"]')

  baseLocationFieldErrorMessage = (): PageElement => cy.get('#baseLocation-error')
}
