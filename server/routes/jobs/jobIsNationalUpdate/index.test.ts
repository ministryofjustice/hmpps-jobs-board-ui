import { Router } from 'express'
import Controller from './jobIsNationalUpdateController'
import routes from './index'
import { Services } from '../../../services'

jest.mock('./jobIsNationalUpdateController')

describe('jobIsNationalUpdate routes', () => {
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
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/jobs/job/:id/is-this-national-job/:mode',
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/jobs/job/:id/is-this-national-job/:mode',
      expect.any(Function), // controller.post
    )
  })
})
