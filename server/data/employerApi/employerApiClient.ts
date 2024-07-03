import config from '../../config'
import RestClient from '../restClient'
import GetEmployerResponse from './getEmployerResponse'
import PutEmployerData from './putEmployerData'

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
}
