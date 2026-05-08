import Page, { PageElement } from '../page'

export default class EmployerListPage extends Page {
  addEmployerButton = (): PageElement => cy.get('#addEmployerButton')

  employerLink = (index: number) => cy.get(`#employer-link-${index}`)

  // pagination
  nextLink = () => cy.get('.govuk-pagination__next')

  previousLink = () => cy.get('.govuk-pagination__prev')

  paginationResults = () => cy.get('.moj-pagination__results')

  // Filters
  employerNameFilterField = (): PageElement => cy.get('#employerNameFilter')

  employerSectorFilterField = (): PageElement => cy.get('#employerSectorFilter')

  employerNameFilterPageErrorMessage = (): PageElement => cy.get('[href="#employerNameFilter"]')

  applyFiltersButton = (): PageElement => cy.get('#applyFiltersButton')

  noResultsMessage = (): PageElement => cy.get('#no-results-message')

  clearFiltersLink = (): PageElement => cy.get('#filter-clear-link')
}
