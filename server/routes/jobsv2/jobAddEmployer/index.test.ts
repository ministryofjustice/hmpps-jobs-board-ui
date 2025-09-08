import { Router } from 'express'
import Controller from './jobAddEmployerController'
import routes from './index'
import { Services } from '../../../services'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'

jest.mock('./jobAddEmployerController')
jest.mock('../../../middleware/resolvers/getAllEmployersResolver')

describe('jobAddEmployer routes', () => {
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
      '/jobs/job/:id/add-employer/:mode',
      [
        expect.any(Function), // getAllEmployersResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/jobs/job/:id/add-employer/:mode',
      expect.any(Function), // controller.get
    )
  })
})
