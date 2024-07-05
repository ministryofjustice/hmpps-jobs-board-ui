import { stubFor } from './wiremock'

const putEmployer = () =>
  stubFor({
    request: {
      method: 'PUT',
      urlPathTemplate: `/employers/{id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const getEmployer = (id: string) =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/employers/${id}`,
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

export default {
  putEmployer,
  getEmployer,
}
