/* eslint-disable @typescript-eslint/no-explicit-any */
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import Controller from './employerReviewController'
import expressMocks from '../../../testutils/expressMocks'
import { setSessionData } from '../../../utils'
import addressLookup from '../../addressLookup'
import config from '../../../config'

const uuidv7 = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
jest.mock('uuid', () => ({ v7: () => uuidv7 }))

describe('EmployerReviewController', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'MOCK_USER' }

  req.params.id = 'new'
  const { id } = req.params

  const employer = {
    employerName: 'mock_employerName',
    employerDescription: 'mock_employerDescription',
    employerSector: 'mock_employerSector',
    employerStatus: 'mock_employerStatus',
  }

  const mockData = {
    id,
    ...employer,
  }

  setSessionData(req, ['employer', id], employer)

  const mockService: any = {
    createUpdateEmployer: jest.fn(),
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

      expect(res.render).toHaveBeenCalledWith('pages/employers/employerReview/index', {
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

      setSessionData(req, ['employerReview', id], mockData)

      config.apis.hmppsAudit.enabled = true
      auditSpy.mockReset()
      auditSpy.mockResolvedValue()
    })

    it('Should create a new instance', () => {
      expect(controller).toBeDefined()
    })

    it('Handles server validation errors correctly', async () => {
      const error = { status: 400, data: { details: [{ code: 'VALIDATION_ERROR' }] } }
      mockService.createUpdateEmployer.mockRejectedValue(error)

      await controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/serverValidationError/index',
        expect.objectContaining({ errorCode: 'VALIDATION_ERROR' }),
      )
    })

    it('Handles API success and redirects', async () => {
      mockService.createUpdateEmployer.mockResolvedValue({})
      await controller.post(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`${addressLookup.employers.employerList()}?sort=name&order=ascending`)
    })

    it('Audits create employer', async () => {
      setSessionData(req, ['employer', id], employer)
      mockService.createUpdateEmployer.mockResolvedValue({})
      await controller.post(req, res, next)

      expect(auditSpy).toHaveBeenCalledTimes(1)
      expect(auditSpy).toHaveBeenCalledWith({
        action: 'CREATE_EMPLOYER',
        who: res.locals.user.username,
        service: config.apis.hmppsAudit.auditServiceName,
        subjectId: uuidv7,
        subjectType: 'NOT_APPLICABLE',
      })
    })

    it('Audits update employer', async () => {
      const existingEmployerId = '123456789'
      setSessionData(req, ['employer', existingEmployerId], employer)
      mockService.createUpdateEmployer.mockResolvedValue({})
      await controller.post({ ...req, ...{ params: { id: existingEmployerId } } }, res, next)

      expect(auditSpy).toHaveBeenCalledTimes(1)
      expect(auditSpy).toHaveBeenCalledWith({
        action: 'UPDATE_EMPLOYER',
        who: res.locals.user.username,
        service: config.apis.hmppsAudit.auditServiceName,
        subjectId: existingEmployerId,
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
