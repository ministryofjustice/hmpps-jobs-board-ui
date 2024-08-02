/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from './jobRequirementsUpdateController'
import expressMocks from '../../../testutils/expressMocks'
import validateFormSchema from '../../../utils/validateFormSchema'
import { deleteSessionData, setSessionData } from '../../../utils/session'
import addressLookup from '../../addressLookup'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('jobRequirementsUpdateController', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'MOCK_USER' }

  req.params.id = 'new'
  req.params.mode = 'add'
  const { id, mode } = req.params

  const mockData = {
    id,
    mode,
    backLocation: '/jobs/job/new/contract/add',
    offenceExclusions: [] as any[],
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

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobRequirementsUpdate/index', {
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
      setSessionData(req, ['jobRequirementsUpdate', id], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobRequirementsUpdate/index', {
        ...mockData,
        errors,
      })
    })

    it('On success - Sets session and redirects to jobHowToApplysUpdate', async () => {
      req.body.essentialCriteria = 'Some text'
      req.body.desirableCriteriareq = 'Some text'
      req.body.description = 'Some text'
      req.body.offenceExclusions = ['SUMMOTR']

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.jobs.jobHowToApplysUpdate(id))
    })
  })
})
