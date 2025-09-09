/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from './jobIsNationalJobController'
import expressMocks from '../../../testutils/expressMocks'
import validateFormSchema from '../../../utils/validateFormSchema'
import { setSessionData } from '../../../utils/session'
import addressLookup from '../../addressLookup'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('jobIsNationalJobController', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'MOCK_USER' }

  req.params.id = 'new'
  req.params.mode = 'add'
  const { id, mode } = req.params

  const mockData = {
    id,
    mode,
    backLocation: '/jobs?sort=jobTitle&order=ascending',
  }

  const controller = new Controller()

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

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobIsNationalJob/index', {
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
      setSessionData(req, ['jobIsNationalJob', id], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobIsNationalJob/index', {
        ...mockData,
        errors,
      })
    })

    it('On success - Sets session and redirects to jobRoleUpdate', async () => {
      req.body.employerId = 'test id'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.jobs.jobRoleUpdate(id, mode))
    })
  })
})
