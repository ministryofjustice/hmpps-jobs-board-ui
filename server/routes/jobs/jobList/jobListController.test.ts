/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import expressMocks from '../../../testutils/expressMocks'
import Controller from './jobListController'
import validateFormSchema from '../../../utils/validateFormSchema'
import { getSessionData, setSessionData } from '../../../utils/session'
import JobViewModel from '../../../viewModels/jobViewModel'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('EmployerListController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.jobs = {
    content: [
      {
        id: '01907e1e-bb85-7bb7-9018-33a2070a367d',
        name: 'ASDA',
        description: 'Some text',
        sector: 'RETAIL',
        status: 'GOLD',
        createdAt: '2024-07-04T15:21:02.497176',
        // createdBy: 'MOCK_USER',
      },
    ],
    page: {
      totalElements: 1,
    },
  }

  req.params.sort = 'name'
  req.params.order = 'descending'
  const { sort, order } = req.params

  req.query = { sort, order }
  req.get = jest.fn()

  const mockData = {
    jobListResults: {
      content: plainToClass(JobViewModel, req.context.jobs.content),
      page: {
        totalElements: 1,
      },
    },
    jobTitleOrEmployerNameFilter: '',
    jobSectorFilter: '',
    filtered: false,
    myOwnJobsFilter: false,
    order: 'descending',
    paginationData: {},
    sort: 'name',
  }

  const mockPaginationService: any = {
    paginationData: {},
    getPagination: jest.fn(),
  }

  const paginationData = {}

  const controller = new Controller(mockPaginationService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      await controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - records found - call renders with the correct data', async () => {
      await controller.get(req, res, next)
      next.mockReset()

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobList/index', mockData)
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
      setSessionData(req, ['jobList', 'data'], mockData)
      mockPaginationService.getPagination.mockReturnValue(paginationData)
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

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobList/index', {
        ...mockData,
        errors,
      })
    })

    it('On successful POST - call renders with the correct data', async () => {
      req.body.jobTitleOrEmployerNameFilter = 'name1'
      req.body.jobSectorFilter = 'TEST_STATUS'

      controller.post(req, res, next)

      expect(getSessionData(req, ['jobList', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `/jobs?sort=name&order=descending&jobTitleOrEmployerNameFilter=name1&jobSectorFilter=TEST_STATUS`,
      )
    })
  })
})
