/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import mockJobs from '../mockData/mockJobs'
import { stubFor } from './wiremock'

const putJob = () =>
  stubFor({
    request: {
      method: 'PUT',
      urlPathTemplate: `/jobs/{id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const getJob = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathTemplate: `/jobs/{id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        employerId: '01907e1e-bb85-7bb7-9018-33a2070a367d',
        jobTitle: 'Warehouse operator',
        sector: 'WAREHOUSING',
        industrySector: 'ADMIN_SUPPORT',
        numberOfVacancies: 1,
        sourcePrimary: 'NFN',
        sourceSecondary: 'PEL',
        charityName: 'Heart foundation',
        postcode: 'NE236DR',
        salaryFrom: 25000,
        salaryTo: 30000,
        salaryPeriod: 'PER_YEAR',
        additionalSalaryInformation: '10% Performance bonus',
        isPayingAtLeastNationalMinimumWage: true,
        workPattern: 'FLEXI_TIME',
        contractType: 'PERMANENT',
        hoursPerWeek: 'FULL_TIME_40_PLUS',
        baseLocation: 'WORKPLACE',
        essentialCriteria: 'Some essential criteria',
        desirableCriteria: 'Some desirable criteria',
        jobDescription: 'Some job description',
        offenceExclusions: ['ARSON', 'TERRORISM'],
        howToApply: 'Some apply details',
        closingDate: '2025-02-01T00:00:00.000Z',
        startDate: '2025-05-31T23:00:00.000Z',
        isRollingOpportunity: false,
        isOnlyForPrisonLeavers: true,
        supportingDocumentationRequired: ['CV', 'OTHER'],
        supportingDocumentationDetails: 'Covering letter',
      },
    },
  })

const getJobs = (
  params: {
    page?: number
    sort?: string
    order?: string
    jobTitleOrEmployerNameFilter?: string
    jobSectorFilter?: string
  } = {},
) => {
  const { page = 1, jobTitleOrEmployerNameFilter, jobSectorFilter, sort, order } = params
  const pageSize = 20

  let jobs = mockJobs

  if (jobTitleOrEmployerNameFilter) {
    jobs = jobs.filter(p => p.jobTitle.toLowerCase().indexOf(jobTitleOrEmployerNameFilter.toLocaleLowerCase()) > -1)
  }

  if (jobSectorFilter) {
    jobs = jobs.filter(p => jobSectorFilter.split(',').includes(p.sector))
  }

  if (sort) {
    jobs = _.orderBy(jobs, [sort], [order === 'ascending' ? 'asc' : 'desc'])
  }

  const chunkedJobs = _.chunk(jobs, pageSize)
  const currentPage: number = page ? page - 1 : 0
  const contents = chunkedJobs

  const pageMetaData = {
    page: {
      size: pageSize,
      number: currentPage,
      totalElements: jobs.length,
      totalPages: chunkedJobs.length,
    },
  }

  const results = {
    content: contents[currentPage],
    ...pageMetaData,
  } as any

  return stubFor({
    request: {
      method: 'GET',
      urlPath: `/jobs`,
      queryParameters: {
        page: {
          matches: '.*',
        },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: results,
    },
  })
}

export default {
  putJob,
  getJob,
  getJobs,
}
