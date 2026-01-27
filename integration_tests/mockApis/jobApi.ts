/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import { SuperAgentRequest } from 'superagent'
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
        postCode: 'NE236DR',
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
        description: 'Some job description',
        offenceExclusions: ['ARSON', 'TERRORISM', 'OTHER'],
        offenceExclusionsDetails: 'Some details',
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

const getJobIndex5 = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathTemplate: '/jobs/01907e1e-bb85-7bb7-9018-33a2070a367e',
    },
    priority: 1,
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        employerId: '01907e1e-bb85-7bb7-9018-33a2070a367d',
        jobTitle: 'Beautician',
        sector: 'BEAUTY',
        industrySector: 'ADMIN_SUPPORT',
        numberOfVacancies: 1,
        sourcePrimary: 'NFN',
        sourceSecondary: 'PEL',
        charityName: 'Heart foundation',
        postCode: 'NE236DR',
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
        description: 'Some job description',
        offenceExclusions: ['ARSON', 'TERRORISM', 'OTHER'],
        offenceExclusionsDetails: 'Some details',
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

const getNationalJob = () =>
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
        jobTitle: 'National Warehouse operator',
        sector: 'WAREHOUSING',
        industrySector: 'ADMIN_SUPPORT',
        numberOfVacancies: 1,
        sourcePrimary: 'NFN',
        sourceSecondary: 'PEL',
        charityName: 'Heart foundation',
        postcode: null,
        isNational: true,
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
        description: 'Some job description',
        offenceExclusions: ['ARSON', 'TERRORISM', 'OTHER'],
        offenceExclusionsDetails: 'Some details',
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
    username?: string
    page?: number
    sort?: string
    order?: string
    jobTitleOrEmployerNameFilter?: string
    jobSectorFilter?: string
    myOwnJobsFilter?: boolean
  } = {},
) => {
  const { page = 1, jobTitleOrEmployerNameFilter, jobSectorFilter, sort, order, myOwnJobsFilter } = params
  const pageSize = 20

  let jobs = mockJobs

  if (jobTitleOrEmployerNameFilter) {
    jobs = jobs.filter(p => p.jobTitle.toLowerCase().indexOf(jobTitleOrEmployerNameFilter.toLocaleLowerCase()) > -1)
  }

  if (jobSectorFilter) {
    jobs = jobs.filter(p => jobSectorFilter.split(',').includes(p.sector))
  }

  if (myOwnJobsFilter) {
    jobs = jobs.filter(p => p.createdAt === 'USER1')
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
      jsonBody: { ...results },
    },
  })
}

const stubJobApiPing = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/health/ping',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

export default {
  putJob,
  getJob,
  getJobIndex5,
  getNationalJob,
  getJobs,
  stubJobApiPing,
}
