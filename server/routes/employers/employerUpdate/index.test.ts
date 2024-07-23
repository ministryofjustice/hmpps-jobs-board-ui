import { Router } from 'express'
import Controller from './employerUpdateController'
import routes from './index'

jest.mock('./employerUpdateController')

describe('employerUpdate routes', () => {
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
      '/employers/employer/:id/form/:mode',
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router)

    expect(router.post).toHaveBeenCalledWith(
      '/employers/employer/:id/form/:mode',
      expect.any(Function), // controller.get
    )
  })
})
