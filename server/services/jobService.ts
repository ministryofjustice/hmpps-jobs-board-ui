import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApiClient from '../data/jobApi/jobApiClient'
import PutJobData from '../data/jobApi/putJobData'

export default class JobService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async createUpdateJob(username: string, id: string, params: PutJobData) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    // Use existing id and put
    return new JobApiClient(systemToken).putJob(id, { ...params })
  }

  async getJob(username: string, id: string) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getJob(id)
  }

  async getJobs(
    username: string,
    params: {
      page?: number
      sort?: string
      order?: string
      jobTitleOrEmployerNameFilter?: string
      jobSectorFilter?: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getJobs(params)
  }
}
