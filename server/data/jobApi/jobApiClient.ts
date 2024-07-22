import config from '../../config'
import RestClient from '../restClient'
import GetJobResponse from './getJobReaponse'
import PutJobData from './putJobData'

export default class JobApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Job job API', config.apis.jobApi, token)
  }

  async getJob(id: string) {
    const results = await this.restClient.get<GetJobResponse>({
      path: `/jobs/${id}`,
    })

    return results
  }

  async putJob(id: string, jobData: PutJobData) {
    const result = await this.restClient.put({
      path: `/jobs/${id}`,
      data: {
        ...jobData,
      },
    })

    return result
  }
}
