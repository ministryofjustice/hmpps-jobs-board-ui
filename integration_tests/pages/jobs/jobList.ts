import Page, { PageElement } from '../page'

export default class JobListPage extends Page {
  addJobButton = (): PageElement => cy.get('#addJobButton')

  jobLink = (index: number) => cy.get(`#job-link-${index}`)

  // pagination
  nextLink = () => cy.get('.moj-pagination__item--next')

  previousLink = () => cy.get('.moj-pagination__item--prev')

  paginationResults = () => cy.get('.moj-pagination__results')

  // Filters
  jobTitleOrEmployerNameFilterField = (): PageElement => cy.get('#jobTitleOrEmployerNameFilter')

  jobSectorFilterField = (): PageElement => cy.get('#jobSectorFilter')

  jobTitleOrEmployerNameFilterPageErrorMessage = (): PageElement => cy.get('[href="#jobTitleOrEmployerNameFilter"]')

  applyFiltersButton = (): PageElement => cy.get('#applyFiltersButton')

  noResultsMessage = (): PageElement => cy.get('#no-results-message')

  clearFiltersLink = (): PageElement => cy.get('#filter-clear-link')
}
