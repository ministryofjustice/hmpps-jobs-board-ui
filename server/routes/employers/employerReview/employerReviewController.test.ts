/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from './employerReviewController'
import expressMocks from '../../../testutils/expressMocks'
import { setSessionData } from '../../../utils/session'
import addressLookup from '../../addressLookup'

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
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      setSessionData(req, ['employerReview', id], mockData)
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
