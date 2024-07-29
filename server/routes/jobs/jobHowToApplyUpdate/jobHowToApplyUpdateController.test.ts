/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from './jobHowToApplyUpdateController'
import expressMocks from '../../../testutils/expressMocks'
import validateFormSchema from '../../../utils/validateFormSchema'
import { deleteSessionData, setSessionData } from '../../../utils/session'
import addressLookup from '../../addressLookup'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('jobHowToApplyUpdateController', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'MOCK_USER' }

  req.params.id = 'new'
  req.params.mode = 'add'
  const { id, mode } = req.params

  const mockData = {
    id,
    mode,
    backLocation: '/jobs/job/new/requirements/add',
    supportingDocumentationRequired: [] as any[],
    closingDate: {
      'closingDate-day': '',
      'closingDate-month': '',
      'closingDate-year': '',
    },
    startDate: {
      'startDate-day': '',
      'startDate-month': '',
      'startDate-year': '',
    },
  }

  const controller = new Controller()

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

    it('On success - If no job redirects to jobRoleUpdate', async () => {
      deleteSessionData(req, ['job', id])

      controller.get(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.jobs.jobRoleUpdate(id))
    })

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobHowToApplyUpdate/index', {
        ...mockData,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }
    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      validationMock.mockReset()
      setSessionData(req, ['jobHowToApplyUpdate', id], mockData)
    })

    it('Should create a new instance', () => {
      expect(controller).toBeDefined()
    })

    it('On error - Calls next with error', async () => {
      validationMock.mockImplementation(() => {
        throw new Error('mock_error')
      })

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On validation error - Calls render with correct data', async () => {
      validationMock.mockImplementation(() => errors)
      controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobHowToApplyUpdate/index', {
        ...mockData,
        closingDate: {
          'closingDate-day': undefined,
          'closingDate-month': undefined,
          'closingDate-year': undefined,
          'closingDate-day-error': undefined,
          'closingDate-month-error': undefined,
          'closingDate-year-error': undefined,
        },
        startDate: {
          'startDate-day': undefined,
          'startDate-month': undefined,
          'startDate-year': undefined,
          'startDate-day-error': undefined,
          'startDate-month-error': undefined,
          'startDate-year-error': undefined,
        },
        errors,
      })
    })

    it('On success - Sets session and redirects to jobReview', async () => {
      req.body.essentialCriteria = 'Some text'
      req.body.jobDescription = 'Some text'
      req.body.offenceExclusions = ['SUMMOTR']

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.jobs.jobReview(id))
    })
  })
})
