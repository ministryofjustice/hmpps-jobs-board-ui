/* eslint-disable @typescript-eslint/no-explicit-any */
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import Controller from './jobReviewController'
import expressMocks from '../../../testutils/expressMocks'
import { setSessionData } from '../../../utils'
import addressLookup from '../../addressLookup'
import config from '../../../config'

const uuidv7 = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
jest.mock('uuid', () => ({ v7: () => uuidv7 }))

describe('JobReviewController', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'MOCK_USER' }

  req.context.allEmployers = [
    {
      id: '01907e1e-bb85-7bb7-9018-33a2070a367d',
      name: 'ASDA',
      description: 'Some text\r\nSome more text',
      sector: 'RETAIL',
      status: 'GOLD',
      createdAt: '2024-07-04T15:21:02.497176',
    },
  ]

  req.params.id = 'new'
  const { id } = req.params

  const job = {
    employerId: '01907e1e-bb85-7bb7-9018-33a2070a367d',
    jobTitle: 'job title',
    closingDate: '2025-02-01T00:00:00.000Z',
    startDate: '2025-05-31T23:00:00.000Z',
  }

  const mockData = {
    id,
    ...job,
    employerName: 'ASDA',
    closingDate: '1 February 2025',
    startDate: '1 June 2025',
  }

  setSessionData(req, ['job', id], job)

  const mockService: any = {
    createUpdateJob: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobReview/index', {
        ...mockData,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    const auditSpy = jest.spyOn(auditService, 'sendAuditMessage')

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()

      setSessionData(req, ['jobReview', id], mockData)

      config.apis.hmppsAudit.enabled = true
      auditSpy.mockReset()
      auditSpy.mockResolvedValue()
    })

    it('Should create a new instance', () => {
      expect(controller).toBeDefined()
    })

    it('Handles server validation errors correctly', async () => {
      const error = { status: 400, data: { details: [{ code: 'VALIDATION_ERROR' }] } }
      mockService.createUpdateJob.mockRejectedValue(error)

      await controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/serverValidationError/index',
        expect.objectContaining({ errorCode: 'VALIDATION_ERROR' }),
      )
    })

    it('Handles API success and redirects', async () => {
      mockService.createUpdateJob.mockResolvedValue({})
      await controller.post(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`${addressLookup.jobs.jobList()}?sort=jobTitle&order=ascending`)
    })

    it('Audits create job', async () => {
      setSessionData(req, ['job', id], job)
      mockService.createUpdateJob.mockResolvedValue({})
      await controller.post(req, res, next)

      expect(auditSpy).toHaveBeenCalledTimes(1)
      expect(auditSpy).toHaveBeenCalledWith({
        action: 'CREATE_JOB',
        who: res.locals.user.username,
        service: config.apis.hmppsAudit.auditServiceName,
        subjectId: uuidv7,
        subjectType: 'NOT_APPLICABLE',
      })
    })

    it('Audits update job', async () => {
      const existingJobId = '123456789'
      setSessionData(req, ['job', existingJobId], job)
      mockService.createUpdateJob.mockResolvedValue({})

      controller.post({ ...req, ...{ params: { id: existingJobId } } }, res, next)

      expect(auditSpy).toHaveBeenCalledTimes(1)
      expect(auditSpy).toHaveBeenCalledWith({
        action: 'UPDATE_JOB',
        who: res.locals.user.username,
        service: config.apis.hmppsAudit.auditServiceName,
        subjectId: existingJobId,
        subjectType: 'NOT_APPLICABLE',
      })
    })

    it('On error - Calls next with error', async () => {
      res.redirect.mockImplementation(() => {
        throw new Error('mock_error')
      })

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })
  })
})
