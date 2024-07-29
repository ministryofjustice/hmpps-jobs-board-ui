import config from '../../config'
import RestClient from '../restClient'
import GetEmployerResponse from './getEmployerResponse'
import PutEmployerData from './putEmployerData'
import PagedResponse from '../domain/types/pagedResponse'

export default class EmployerApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Employer API', config.apis.jobApi, token)
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

  async getEmployers(params: {
    page?: number
    sort?: string
    order?: string
    employerNameFilter?: string
    employerSectorFilter?: string
  }) {
    const { page = 1, employerNameFilter, employerSectorFilter, sort, order } = params

    const uri = [
      `page=${page - 1}`,
      `size=${config.paginationPageSize}`,
      sort && `sortby=${sort}`,
      order && `sortOrder=${order === 'ascending' ? 'asc' : 'desc'}`,
      employerNameFilter && `name=${encodeURIComponent(employerNameFilter)}`,
      employerSectorFilter && `sector=${encodeURIComponent(employerSectorFilter)}`,
    ].filter(val => !!val)

    return this.restClient.get<PagedResponse<GetEmployerResponse>>({
      path: `/employers?${uri.join('&')}`,
    })
  }

  async getAllEmployers() {
    return this.restClient.get<PagedResponse<GetEmployerResponse>>({
      path: `/employers?page=0&size=9999`,
    })
  }
}
