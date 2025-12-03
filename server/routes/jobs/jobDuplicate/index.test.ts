import { Router } from 'express'
import Controller from './jobDuplicateController'
import { Services } from '../../../services'
import routes from './index'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'
import getJobDuplicateResolver from '../../../middleware/resolvers/getJobDuplicateResolver'

jest.mock('./jobDuplicateController')
jest.mock('../../../middleware/resolvers/getJobDuplicateResolver')
jest.mock('../../../middleware/resolvers/getAllEmployersResolver')

describe('jobDuplicate routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      jobService: {},
      employerService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getJobDuplicateResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getAllEmployersResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/jobs/job/:id/duplicate',
      [
        expect.any(Function), // getJobDuplicateResolver
        expect.any(Function), // getAllEmployersResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/jobs/job/:id/duplicate',
      expect.any(Function), // controller.get
    )
  })
})
