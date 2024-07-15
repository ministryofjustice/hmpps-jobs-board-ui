/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import EmployerService from '../../services/employerService'
import getEmployerListResolver from './getEmployerListResolver'

jest.mock('../../services/employerService')

describe('getEmployerListResolver Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let employerService: jest.Mocked<EmployerService>

  beforeEach(() => {
    req = {
      query: {
        page: '1',
        sort: 'name',
        order: 'asc',
        employerSectorFilter: 'RETAIL',
        employerNameFilter: 'ASDA',
      },
      context: {},
    }
    res = {
      locals: {
        user: {
          username: 'testuser',
        },
      },
    }
    next = jest.fn()

    employerService = new EmployerService({} as any) as jest.Mocked<EmployerService>
  })

  it('should call employerService.getEmployers and attach employers to req.context', async () => {
    const mockEmployers = { content: [{ id: '1', name: 'ASDA' }] }
    employerService.getEmployers.mockResolvedValue(mockEmployers as any)

    const middleware = getEmployerListResolver(employerService)
    await middleware(req as Request, res as Response, next)

    expect(employerService.getEmployers).toHaveBeenCalledWith('testuser', {
      page: 1,
      sort: 'name',
      order: 'asc',
      employerSectorFilter: 'RETAIL',
      employerNameFilter: 'ASDA',
    })
    expect(req.context.employers).toEqual(mockEmployers)
    expect(next).toHaveBeenCalledWith()
  })

  it('should call next with an error when employerService.getEmployers throws an error', async () => {
    const error = new Error('Service error')
    employerService.getEmployers.mockRejectedValue(error)

    const middleware = getEmployerListResolver(employerService)
    await middleware(req as Request, res as Response, next)

    expect(employerService.getEmployers).toHaveBeenCalledWith('testuser', {
      page: 1,
      sort: 'name',
      order: 'asc',
      employerSectorFilter: 'RETAIL',
      employerNameFilter: 'ASDA',
    })
    expect(next).toHaveBeenCalledWith(error)
  })
})
