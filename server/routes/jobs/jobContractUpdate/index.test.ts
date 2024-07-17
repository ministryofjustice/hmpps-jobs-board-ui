import { Router } from 'express'
import Controller from './jobContractUpdateController'
import routes from './index'
import { Services } from '../../../services'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'

jest.mock('./jobContractUpdateController')
jest.mock('../../../middleware/resolvers/getAllEmployersResolver')

describe('jobContractUpdate routes', () => {
  let router: Router
  let services: Services
  beforeEach(() => {
    services = {
      jobService: {},
    } as unknown as Services
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getAllEmployersResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/jobs/job/:id/contract',
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/jobs/job/:id/contract',
      expect.any(Function), // controller.get
    )
  })
})
