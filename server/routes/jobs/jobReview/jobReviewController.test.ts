/* eslint-disable @typescript-eslint/no-explicit-any */
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import Controller from './jobReviewController'
import expressMocks from '../../../testutils/expressMocks'
import { setSessionData } from '../../../utils'
import addressLookup from '../../addressLookup'
import config from '../../../config'
import offenceExclusions from '../../../enums/offenceExclusions'
import workPattern from '../../../enums/workPattern'
import validateFormSchema from '../../../utils/validateFormSchema'

const uuidv7 = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
jest.mock('uuid', () => ({ v7: () => uuidv7 }))

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

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
    closingDate: '2025-02-01',
    startDate: '2025-05-31',
    contractType: 'PERMANENT',
    description: 'job description',
    essentialCriteria: 'requirements',
    hoursPerWeek: 'FULL_TIME',
    howToApply: 'how to apply',
    industrySector: 'ADMIN_SUPPORT',
    isOnlyForPrisonLeavers: 'NO',
    isPayingAtLeastNationalMinimumWage: 'YES',
    isRollingOpportunity: 'NO',
    numberOfVacancies: '1',
    offenceExclusions: [offenceExclusions.CASE_BY_CASE],
    offenceExclusionsDetails: 'offence exclusions details',
    postCode: 'AB1 2CD',
    salaryFrom: '20000',
    salaryTo: '30000',
    salaryPeriod: 'PER_YEAR',
    sector: 'RETAIL',
    sourcePrimary: 'DWP',
    workPattern: workPattern.FLEXI_TIME,
  }

  const mockData = {
    id,
    ...job,
    employerName: 'ASDA',
    closingDate: '1 February 2025',
    startDate: '31 May 2025',
  }

  setSessionData(req, ['job', id], job)

  const mockService: any = {
    createUpdateJob: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    const errors = { details: 'mock_error' }
    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      validationMock.mockReset()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On validation error - Calls render with correct data', async () => {
      setSessionData(req, ['job', id], mockData)
      validationMock.mockImplementation(() => errors)
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobReview/index', {
        ...mockData,
        errors,
      })
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
    const errors = { details: 'mock_error' }
    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      validationMock.mockReset()

      setSessionData(req, ['jobReview', id], mockData)

      config.hmppsAudit.enabled = true
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
        service: config.hmppsAudit.auditServiceName,
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
        service: config.hmppsAudit.auditServiceName,
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

    it('On validation error - Calls render with correct data', async () => {
      validationMock.mockImplementation(() => errors)
      setSessionData(req, ['job', id], mockData)
      controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobReview/index', {
        ...mockData,
        errors,
      })
    })
  })
})
