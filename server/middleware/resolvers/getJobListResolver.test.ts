/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import JobService from '../../services/jobService'
import getJobListResolver from './getJobListResolver'

jest.mock('../../services/jobService')

describe('getJobListResolver Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let jobService: jest.Mocked<JobService>

  beforeEach(() => {
    req = {
      query: {
        page: '1',
        sort: 'name',
        order: 'asc',
        jobSectorFilter: 'RETAIL',
        jobTitleOrEmployerNameFilter: 'ASDA',
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

  it('should call jobService.getJobs and attach jobs to req.context', async () => {
    const mockJobs = { content: [{ id: '1', name: 'ASDA' }] }
    jobService.getJobs.mockResolvedValue(mockJobs as any)

    const middleware = getJobListResolver(jobService)
    await middleware(req as Request, res as Response, next)

    expect(jobService.getJobs).toHaveBeenCalledWith('testuser', {
      page: 1,
      sort: 'name',
      order: 'asc',
      jobSectorFilter: 'RETAIL',
      jobTitleOrEmployerNameFilter: 'ASDA',
    })
    expect(req.context.jobs).toEqual(mockJobs)
    expect(next).toHaveBeenCalledWith()
  })

  it('should call next with an error when jobService.getJobs throws an error', async () => {
    const error = new Error('Service error')
    jobService.getJobs.mockRejectedValue(error)

    const middleware = getJobListResolver(jobService)
    await middleware(req as Request, res as Response, next)

    expect(jobService.getJobs).toHaveBeenCalledWith('testuser', {
      page: 1,
      sort: 'name',
      order: 'asc',
      jobSectorFilter: 'RETAIL',
      jobTitleOrEmployerNameFilter: 'ASDA',
    })
    expect(next).toHaveBeenCalledWith(error)
  })
})
