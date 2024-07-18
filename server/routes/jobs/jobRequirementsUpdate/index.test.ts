import { Router } from 'express'
import Controller from './jobRequirementsUpdateController'
import routes from './index'
import { Services } from '../../../services'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

jest.mock('./jobRequirementsUpdateController')
jest.mock('../../../middleware/parseCheckBoxValue')

describe('jobRequirementsUpdate routes', () => {
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
    ;(parseCheckBoxValue as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/jobs/job/:id/requirements',
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/jobs/job/:id/requirements',
      [
        expect.any(Function), // parseCheckBoxValue
      ],
      expect.any(Function), // controller.get
    )
  })
})
