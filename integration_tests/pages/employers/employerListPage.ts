import Page, { PageElement } from '../page'

export default class EmployerListPage extends Page {
  addEmployerButton = (): PageElement => cy.get('#addEmployerButton')

  employerLink = (index: number) => cy.get(`#employer-link-${index}`)

  nextLink = () => cy.get('.moj-pagination__item--next')

  previousLink = () => cy.get('.moj-pagination__item--prev')

  paginationResults = () => cy.get('.moj-pagination__results')

  employerNameFilterField = (): PageElement => cy.get('#employerNameFilter')

  employerSectorFilterField = (): PageElement => cy.get('#employerSectorFilter')

  employerNameFilterPageErrorMessage = (): PageElement => cy.get('[href="#employerNameFilter"]')

  applyFiltersButton = (): PageElement => cy.get('#applyFiltersButton')

  noResultsMessage = (): PageElement => cy.get('#no-results-message')

  clearFiltersLink = (): PageElement => cy.get('#filter-clear-link')
}
