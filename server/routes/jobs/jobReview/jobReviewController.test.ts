/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from './jobReviewController'
import expressMocks from '../../../testutils/expressMocks'
import { setSessionData } from '../../../utils/session'

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
    updateJob: jest.fn(),
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
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      setSessionData(req, ['jobReview', id], mockData)
    })

    it('Should create a new instance', () => {
      expect(controller).toBeDefined()
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
