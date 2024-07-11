/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'

import config from '../../config'
import RestClient from '../restClient'
import GetEmployerResponse from './getEmployerResponse'
import PutEmployerData from './putEmployerData'

import mockEmployers from './mock_employers'

export default class EmployerApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Job employer API', config.apis.jobApi, token)
  }

  async getEmployer(id: string) {
    const results = await this.restClient.get<GetEmployerResponse>({
      path: `/employers/${id}`,
    })

    return results
  }

  async putEmployer(id: string, employerData: PutEmployerData) {
    const result = await this.restClient.put({
      path: `/employers/${id}`,
      data: {
        ...employerData,
      },
    })

    return result
  }

  async employerSearch(params: {
    page?: number
    sort?: string
    order?: string
    employerNameFilter?: string
    employerSectorFilter?: string
  }) {
    const { employerNameFilter = '', page = 0, employerSectorFilter, sort, order } = params

    const nameParam = employerNameFilter ? `&name=${employerNameFilter}` : ''
    const sectorParam = employerSectorFilter ? `&sector=${employerSectorFilter}` : ''
    const sortParam = sort ? `&sort=${sort}` : ''
    const orderParam = order ? `&order=${order}` : ''

    let employers = await this.restClient.get<GetEmployerResponse[]>({
      path: `/employers?page=${page}${nameParam}${sectorParam}${sortParam}${orderParam}`,
    })

    // let employers = [employer, ...mockEmployers] as GetEmployerResponse[]

    if (employerNameFilter) {
      employers = employers.filter(p => p.name.toLowerCase().indexOf(employerNameFilter.toLocaleLowerCase()) > -1)
    }

    if (employerSectorFilter) {
      employers = employers.filter(p => employerSectorFilter.split(',').includes(p.sector))
    }

    if (sort) {
      employers = _.orderBy(employers, [sort], [order === 'ascending' ? 'asc' : 'desc'])
    }

    const pageSize = config.paginationPageSize

    const chunkedEmployers = _.chunk(employers, pageSize)
    const currentPage: number = page ? page - 1 : 0
    const contents = chunkedEmployers

    const pageMetaData = {
      pageable: {
        sort: { empty: true, sorted: false, unsorted: true },
        offset: pageSize * currentPage,
        pageSize,
        pageNumber: currentPage,
        paged: true,
        unpaged: false,
      },
      totalElements: employers.length ? employers.length : 0,
      last: currentPage === (contents.length ? contents.length - 1 : 0),
      totalPages: contents ? contents.length : 0,
      size: pageSize,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      first: currentPage === 0,
      numberOfElements: contents.length ? contents[currentPage].length : 0,
      empty: employers.length === 0,
    }

    return {
      content: contents[currentPage],
      ...pageMetaData,
    } as any
  }
}
