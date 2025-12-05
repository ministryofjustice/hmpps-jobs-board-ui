/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import JobService from '../../services/jobService'
import { getSessionData, setSessionData } from '../../utils'
import YesNoValue from '../../enums/yesNoValue'
import getJobDuplicateResolver from './getJobDuplicateResolver'

jest.mock('../../services/jobService')
jest.mock('../../utils/index')

describe('getJobDuplicateResolver Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let jobService: jest.Mocked<JobService>

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

    jobService = new JobService({} as any) as jest.Mocked<JobService>
  })

  it('should call next if job data is in session', async () => {
    ;(getSessionData as jest.Mock).mockReturnValue(true)

    const middleware = getJobDuplicateResolver(jobService)
    await middleware(req as Request, res as Response, next)

    expect(getSessionData).toHaveBeenCalledWith(req, ['job', 'new'])
    expect(next).toHaveBeenCalled()
    expect(jobService.getJob).not.toHaveBeenCalled()
  })

  it('should call jobService.getJob and set session data if job data is not in session', async () => {
    const mockJob = {
      isPayingAtLeastNationalMinimumWage: true,
      isRollingOpportunity: false,
      isOnlyForPrisonLeavers: true,
      id: 'new',
      sourceJobId: '123',
    }
    ;(getSessionData as jest.Mock).mockReturnValue(false)
    jobService.getJob.mockResolvedValue(mockJob as any)

    const middleware = getJobDuplicateResolver(jobService)
    await middleware(req as Request, res as Response, next)

    expect(getSessionData).toHaveBeenCalledWith(req, ['job', 'new'])
    expect(jobService.getJob).toHaveBeenCalledWith('testuser', '123')
    expect(setSessionData).toHaveBeenCalledWith(req, ['job', 'new'], {
      ...mockJob,
      isPayingAtLeastNationalMinimumWage: YesNoValue.YES,
      isRollingOpportunity: YesNoValue.NO,
      isOnlyForPrisonLeavers: YesNoValue.YES,
      isNational: YesNoValue.NO,
    })
    expect(next).toHaveBeenCalled()
  })

  it('should call next with an error if jobService.getJob throws an error', async () => {
    const error = new Error('Service error')
    ;(getSessionData as jest.Mock).mockReturnValue(false)
    jobService.getJob.mockRejectedValue(error)

    const middleware = getJobDuplicateResolver(jobService)
    await middleware(req as Request, res as Response, next)

    expect(getSessionData).toHaveBeenCalledWith(req, ['job', 'new'])
    expect(jobService.getJob).toHaveBeenCalledWith('testuser', '123')
    expect(next).toHaveBeenCalledWith(error)
  })
})
