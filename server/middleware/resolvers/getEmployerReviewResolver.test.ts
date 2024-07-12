/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import EmployerService from '../../services/employerService'
import { getSessionData, setSessionData } from '../../utils'
import getEmployerReviewResolver from './getEmployerReviewResolver'

jest.mock('../../services/employerService')
jest.mock('../../utils/index')

describe('getEmployerReviewResolver Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let employerService: jest.Mocked<EmployerService>

  beforeEach(() => {
    req = {
      params: {
        id: '123',
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

  it('should call next if employer data is in session', async () => {
    ;(getSessionData as jest.Mock).mockReturnValue(true)

    const middleware = getEmployerReviewResolver(employerService)
    await middleware(req as Request, res as Response, next)

    expect(getSessionData).toHaveBeenCalledWith(req, ['employer', '123'])
    expect(next).toHaveBeenCalled()
    expect(employerService.getEmployer).not.toHaveBeenCalled()
  })

  it('should call employerService.getEmployer and set session data if employer data is not in session', async () => {
    const mockEmployer = {
      name: 'ASDA',
      sector: 'RETAIL',
      status: 'GOLD',
      description: 'Some text',
    }
    ;(getSessionData as jest.Mock).mockReturnValue(false)
    employerService.getEmployer.mockResolvedValue(mockEmployer as any)

    const middleware = getEmployerReviewResolver(employerService)
    await middleware(req as Request, res as Response, next)

    expect(getSessionData).toHaveBeenCalledWith(req, ['employer', '123'])
    expect(employerService.getEmployer).toHaveBeenCalledWith('testuser', '123')
    expect(setSessionData).toHaveBeenCalledWith(req, ['employer', '123'], {
      employerName: 'ASDA',
      employerSector: 'RETAIL',
      employerStatus: 'GOLD',
      employerDescription: 'Some text',
    })
    expect(next).toHaveBeenCalled()
  })

  it('should call next with an error if employerService.getEmployer throws an error', async () => {
    const error = new Error('Service error')
    ;(getSessionData as jest.Mock).mockReturnValue(false)
    employerService.getEmployer.mockRejectedValue(error)

    const middleware = getEmployerReviewResolver(employerService)
    await middleware(req as Request, res as Response, next)

    expect(getSessionData).toHaveBeenCalledWith(req, ['employer', '123'])
    expect(employerService.getEmployer).toHaveBeenCalledWith('testuser', '123')
    expect(next).toHaveBeenCalledWith(error)
  })
})
