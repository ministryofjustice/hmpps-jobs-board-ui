import { Router } from 'express'
import Controller from './jobReviewController'
import { Services } from '../../../services'
import routes from './index'
import getJobReviewResolver from '../../../middleware/resolvers/getJobReviewResolver'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'

jest.mock('./jobReviewController')
jest.mock('../../../middleware/resolvers/getJobReviewResolver')
jest.mock('../../../middleware/resolvers/getAllEmployersResolver')

describe('jobReview routes', () => {
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
    ;(getJobReviewResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getAllEmployersResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/jobs/job/:id',
      [
        expect.any(Function), // getJobReviewResolver
        expect.any(Function), // getAllEmployersResolver
      ],
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
