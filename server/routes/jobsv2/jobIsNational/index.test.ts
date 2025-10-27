import { Router } from 'express'
import Controller from './jobIsNationalController'
import routes from './index'

jest.mock('./jobIsNationalController')

describe('jobIsNationalJob routes', () => {
  let router: Router
  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
  })

  it('should register GET route for page', () => {
    routes(router)

    expect(router.get).toHaveBeenCalledWith(
      '/jobsv2/job/:id/is-this-national-job/:mode',
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router)

    expect(router.post).toHaveBeenCalledWith(
      '/jobsv2/job/:id/is-this-national-job/:mode',
      expect.any(Function), // controller.post
    )
  })
})
