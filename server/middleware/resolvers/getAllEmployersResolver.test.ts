/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import EmployerService from '../../services/employerService'
import getAllEmployersResolver from './getAllEmployersResolver'

jest.mock('../../services/employerService')

describe('getAllEmployersResolver Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let employerService: jest.Mocked<EmployerService>

  beforeEach(() => {
    req = {
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

  it('should call employerService.getAllEmployers and attach employers to req.context', async () => {
    const mockEmployers = { content: [{ id: '1', name: 'ASDA' }] }
    employerService.getAllEmployers.mockResolvedValue(mockEmployers as any)

    const middleware = getAllEmployersResolver(employerService)
    await middleware(req as Request, res as Response, next)

    expect(employerService.getAllEmployers).toHaveBeenCalledWith('testuser')
    expect(req.context.allEmployers).toEqual(mockEmployers.content)
    expect(next).toHaveBeenCalledWith()
  })

  it('should call next with an error when employerService.getAllEmployers throws an error', async () => {
    const error = new Error('Service error')
    employerService.getAllEmployers.mockRejectedValue(error)

    const middleware = getAllEmployersResolver(employerService)
    await middleware(req as Request, res as Response, next)

    expect(employerService.getAllEmployers).toHaveBeenCalledWith('testuser')
    expect(next).toHaveBeenCalledWith(error)
  })
})
