/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express'
import apiRoutes from './api'
import employersRoutes from './employers'
import jobsRoutes from './jobs'
import { Services } from '../services'
import routes from '.'

jest.mock('./employers')
jest.mock('./jobs')
jest.mock('./api')
jest.mock('express', () => ({
  Router: jest.fn().mockImplementation(() => ({
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    all: jest.fn(),
  })),
}))

describe('Server routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = Router() as Router
    ;(Router as any).mockImplementation(() => router)
    services = {} as Services
  })

  it('calls all routes with router and services', () => {
    routes(services as any)
    expect(employersRoutes).toHaveBeenCalledWith(router, services)
    expect(jobsRoutes).toHaveBeenCalledWith(router, services)
    expect(apiRoutes).toHaveBeenCalledWith(router)
  })
})
