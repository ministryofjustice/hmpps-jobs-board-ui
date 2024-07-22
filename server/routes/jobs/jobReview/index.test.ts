import { Router } from 'express'
import Controller from './jobReviewController'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./jobReviewController')

describe('jobReview routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      jobService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/jobs/job/:id',
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/jobs/job/:id',
      expect.any(Function), // controller.get
    )
  })
})
