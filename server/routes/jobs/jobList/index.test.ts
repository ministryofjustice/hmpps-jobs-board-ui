import { Router } from 'express'
import Controller from './jobListController'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getJobListResolver from '../../../middleware/resolvers/getJobListResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./jobListController')
jest.mock('../../../middleware/handleSortMiddleware')
jest.mock('../../../middleware/resolvers/getJobListResolver')

describe('jobList routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerSearchService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(handleSortMiddleware as jest.Mock).mockImplementation(() => jest.fn())
    ;(getJobListResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/jobs',
      [
        expect.any(Function), // getJobListResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/jobs',
      [
        expect.any(Function), // handleSortMiddleware
        expect.any(Function), // handleSortMiddleware
      ],
      expect.any(Function), // controller.post
    )
  })
})
