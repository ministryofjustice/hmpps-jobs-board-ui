/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from './jobRoleUpdateController'
import expressMocks from '../../../testutils/expressMocks'
import validateFormSchema from '../../../utils/validateFormSchema'
import { setSessionData } from '../../../utils/session'
import addressLookup from '../../addressLookup'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('jobRoleUpdateController', () => {
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
  req.params.mode = 'add'
  const { id, mode } = req.params

  const mockData = {
    id,
    mode,
    backLocation: '/jobs?sort=jobTitle&order=ascending',
    employers: [
      {
        text: 'ASDA',
        value: '01907e1e-bb85-7bb7-9018-33a2070a367d',
      },
    ],
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

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobRoleUpdate/index', {
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
      setSessionData(req, ['jobRoleUpdate', id], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobRoleUpdate/index', {
        ...mockData,
        errors,
      })
    })

    it('On success - Sets session and redirects to jobContractUpdate', async () => {
      req.body.employerId = 'test id'
      req.body.jobTitle = 'test job title'
      req.body.jobSector = 'OUTDOOR'
      req.body.industrySector = 'AGRICULTURE'
      req.body.numberOfVacancies = '2'
      req.body.jobSourceOne = 'DWP'
      req.body.jobSourceTwo = 'EAB'
      req.body.charity = 'Test chrity'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.jobs.jobContractUpdate(id))
    })
  })
})
