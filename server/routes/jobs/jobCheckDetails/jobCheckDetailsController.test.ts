/* eslint-disable @typescript-eslint/no-explicit-any */
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import Controller from './jobCheckDetailsController'
import expressMocks from '../../../testutils/expressMocks'
import { deleteSessionData, setSessionData } from '../../../utils'
import addressLookup from '../../addressLookup'
import config from '../../../config'
import offenceExclusions from '../../../enums/offenceExclusions'
import workPattern from '../../../enums/workPattern'

const uuidv7 = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
jest.mock('uuid', () => ({ v7: () => uuidv7 }))

describe('jobCheckDetailsController', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'MOCK_USER' }

  req.params.id = 'new'
  req.params.mode = 'add'
  const { id } = req.params

  const mockData = {
    id,
    backLocation: '/jobs/job/new/duplicate',
  }

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

  const mockService: any = {
    createUpdateJob: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['job', id], {})
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - If no job redirects to jobList', async () => {
      deleteSessionData(req, ['job', id])

      controller.get(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.jobs.jobList())
    })

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobCheckDetails/index', {
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
      setSessionData(req, ['jobCheckDetails', id], mockData)

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

      setSessionData(req, ['job', id], job)

      await controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/serverValidationError/index',
        expect.objectContaining({ errorCode: 'VALIDATION_ERROR' }),
      )
    })

    it('Handles API success and redirects', async () => {
      mockService.createUpdateJob.mockResolvedValue({})
      setSessionData(req, ['job', id], job)
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
  })
})
