import { Router } from 'express'
import Controller from './jobHowToApplyUpdateController'
import routes from './index'
import { Services } from '../../../services'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

jest.mock('./jobHowToApplyUpdateController')
jest.mock('../../../middleware/parseCheckBoxValue')

describe('jobHowToApplyUpdate routes', () => {
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
      '/jobs/job/:id/how-to-apply',
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/jobs/job/:id/how-to-apply',
      [
        expect.any(Function), // parseCheckBoxValue
      ],
      expect.any(Function), // controller.get
    )
  })
})
