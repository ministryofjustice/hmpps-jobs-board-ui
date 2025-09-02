import config from '../../config'
import RestClient from '../restClient'
import GetJobResponse from './getJobResponse'
import PutJobData from './putJobData'
import PagedResponse from '../domain/types/pagedResponse'
import GetJobListItemResponse from './getJobListItemReaponse'

export default class JobApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Job API', config.apis.jobApi, token)
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

  async getJobs(params: {
    username: string
    page?: number
    sort?: string
    order?: string
    jobTitleOrEmployerNameFilter?: string
    jobSectorFilter?: string
    myOwnJobsFilter?: boolean
  }) {
    const { page = 1, jobTitleOrEmployerNameFilter, jobSectorFilter, sort, order, myOwnJobsFilter, username } = params

    const uri = [
      `page=${page - 1}`,
      `size=${config.paginationPageSize}`,
      sort && `sortBy=${sort}`,
      order && `sortOrder=${order === 'ascending' ? 'asc' : 'desc'}`,
      jobTitleOrEmployerNameFilter && `jobTitleOrEmployerName=${encodeURIComponent(jobTitleOrEmployerNameFilter)}`,
      jobSectorFilter && `sector=${encodeURIComponent(jobSectorFilter)}`,
      myOwnJobsFilter && username && `createdBy=${encodeURIComponent(username)}`,
    ].filter(val => !!val)

    return this.restClient.get<PagedResponse<GetJobListItemResponse>>({
      path: `/jobs?${uri.join('&')}`,
    })
  }
}
