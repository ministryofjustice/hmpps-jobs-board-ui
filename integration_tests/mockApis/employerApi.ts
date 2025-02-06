/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'

import mockEmployers from '../mockData/mockEmployers'
import { stubFor } from './wiremock'

const errors = {
  DUPLICATE_EMPLOYER: {
    status: 400,
    error: 'Bad Request',
    message: 'Validation failed',
    details: [
      {
        field: 'name',
        message: 'The name provided already exists. Please choose a different name.',
        code: 'DUPLICATE_EMPLOYER',
      },
    ],
    timestamp: '2025-01-30T12:34:56.789Z',
  },
}

const putEmployer = (serverSideError: string) =>
  stubFor({
    request: {
      method: 'PUT',
      urlPathTemplate: `/employers/{id}`,
    },
    response: serverSideError
      ? {
          status: 400,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          jsonBody: errors[serverSideError],
        }
      : {
          status: 200,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          jsonBody: {},
        },
  })

const getEmployer = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathTemplate: `/employers/{id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        name: 'ASDA',
        sector: 'ARTS_ENTERTAINMENT',
        status: 'GOLD',
        description: 'Some employer information and bio',
      },
    },
  })

const getEmployers = (
  params: {
    page?: number
    sort?: string
    order?: string
    employerNameFilter?: string
    employerSectorFilter?: string
  } = {},
) => {
  const { page = 1, employerNameFilter, employerSectorFilter, sort, order } = params
  const pageSize = 20

  let employers = mockEmployers

  if (employerNameFilter) {
    employers = employers.filter(p => p.name.toLowerCase().indexOf(employerNameFilter.toLocaleLowerCase()) > -1)
  }

  if (employerSectorFilter) {
    employers = employers.filter(p => employerSectorFilter.split(',').includes(p.sector))
  }

  if (sort) {
    employers = _.orderBy(employers, [sort], [order === 'ascending' ? 'asc' : 'desc'])
  }

  const chunkedEmployers = _.chunk(employers, pageSize)
  const currentPage: number = page ? page - 1 : 0
  const contents = chunkedEmployers

  const pageMetaData = {
    page: {
      size: pageSize,
      number: currentPage,
      totalElements: employers.length,
      totalPages: chunkedEmployers.length,
    },
  }

  const results = {
    content: contents[currentPage],
    ...pageMetaData,
  } as any

  return stubFor({
    request: {
      method: 'GET',
      urlPath: `/employers`,
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
  putEmployer,
  getEmployer,
  getEmployers,
}
