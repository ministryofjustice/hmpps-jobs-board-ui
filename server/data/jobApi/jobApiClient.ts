/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import config from '../../config'
import RestClient from '../restClient'
import GetJobResponse from './getJobResponse'
import PutJobData from './putJobData'
import mockJobs from './mockJobs'

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

  // async getJobs(params: {
  //   page?: number
  //   sort?: string
  //   order?: string
  //   jobSearchFilter?: string
  //   jobSectorFilter?: string
  // }) {
  //   const { page = 1, jobSearchFilter, jobSectorFilter, sort, order } = params

  //   const uri = [
  //     `page=${page - 1}`,
  //     `size=${config.paginationPageSize}`,
  //     sort && `sortby=${sort}`,
  //     order && `sortOrder=${order === 'ascending' ? 'asc' : 'desc'}`,
  //     jobSearchFilter && `search=${encodeURIComponent(jobSearchFilter)}`,
  //     jobSectorFilter && `jobSector=${encodeURIComponent(jobSectorFilter)}`,
  //   ].filter(val => !!val)

  //   return this.restClient.get<PagedResponse<GetJobListItemResponse>>({
  //     path: `/jobs?${uri.join('&')}`,
  //   })
  // }

  async getJobs(params: {
    page?: number
    sort?: string
    order?: string
    jobSearchFilter?: string
    jobSectorFilter?: string
  }) {
    const { page = 1, jobSearchFilter, jobSectorFilter, sort, order } = params
    const pageSize = 20

    let jobs = mockJobs

    if (jobSearchFilter) {
      jobs = jobs.filter(
        p =>
          p.jobTitle.toLowerCase().indexOf(jobSearchFilter.toLocaleLowerCase()) > -1 ||
          p.employerName.toLowerCase().indexOf(jobSearchFilter.toLocaleLowerCase()) > -1,
      )
    }

    if (jobSectorFilter) {
      jobs = jobs.filter(p => jobSectorFilter.split(',').includes(p.jobSector))
    }

    if (sort) {
      jobs = _.orderBy(jobs, [sort], [order === 'ascending' ? 'asc' : 'desc'])
    }

    const chunkedEmployers = _.chunk(jobs, pageSize)
    const currentPage: number = page ? page - 1 : 0
    const contents = chunkedEmployers

    const pageMetaData = {
      page: {
        size: pageSize,
        number: currentPage,
        totalElements: jobs.length,
        totalPages: chunkedEmployers.length,
      },
    }

    return {
      content: contents[currentPage],
      ...pageMetaData,
    } as any
  }
}
