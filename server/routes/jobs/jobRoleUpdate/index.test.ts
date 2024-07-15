import { Router } from 'express'
import Controller from './jobRoleUpdateController'
import routes from './index'

jest.mock('./jobRoleUpdateController')

describe('jobRoleUpdate routes', () => {
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
      '/jobs/job/:id/role',
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router)

    expect(router.post).toHaveBeenCalledWith(
      '/jobs/job/:id/role',
      expect.any(Function), // controller.get
    )
  })
})
