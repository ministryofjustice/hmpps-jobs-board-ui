import { Router } from 'express'
import Controller from './employerListController'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getEmployerListResolver from '../../../middleware/resolvers/getEmployerListResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./employerListController')
jest.mock('../../../middleware/handleSortMiddleware')
jest.mock('../../../middleware/resolvers/getEmployerListResolver')

describe('employerList routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerSearchService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(handleSortMiddleware as jest.Mock).mockImplementation(() => jest.fn())
    ;(getEmployerListResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/',
      [
        expect.any(Function), // getEmployerListResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/',
      [
        expect.any(Function), // handleSortMiddleware
        expect.any(Function), // handleSortMiddleware
      ],
      expect.any(Function), // controller.post
    )
  })
})
