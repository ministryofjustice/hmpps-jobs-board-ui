import { Router } from 'express'
import Controller from './employerReviewController'
import getEmployerReviewResolver from '../../../middleware/resolvers/getEmployerReviewResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./employerReviewController')
jest.mock('../../../middleware/resolvers/getEmployerReviewResolver')

describe('employerReview routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      employerService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getEmployerReviewResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/employers/employer/:id',
      [expect.any(Function)], // getEmployerReviewResolver
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/employers/employer/:id',
      expect.any(Function), // controller.get
    )
  })
})
