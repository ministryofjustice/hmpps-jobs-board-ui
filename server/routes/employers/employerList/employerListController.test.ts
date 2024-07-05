/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './employerListController'
import validateFormSchema from '../../../utils/validateFormSchema'
import { getSessionData, setSessionData } from '../../../utils/session'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('EmployerListController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.employers = {
    content: [
      {
        name: 'mock_name',
        createdAt: 'mock_createdAt',
        status: 'mock_status',
      },
      {
        name: 'mock_name2',
        createdAt: 'mock_createdAt',
        status: 'mock_status',
      },
    ],
    totalElements: 2,
  }

  req.params.sort = 'name'
  req.params.order = 'descending'
  const { sort, order } = req.params

  req.query = { sort, order }
  req.get = jest.fn()

  const mockData = {
    employerListResults: {
      content: [
        {
          name: 'mock_name',
          createdAt: 'mock_createdAt',
          status: 'mock_status',
        },
        {
          name: 'mock_name2',
          createdAt: 'mock_createdAt',
          status: 'mock_status',
        },
      ],
      totalElements: 2,
    },
    employerNameFilter: '',
    employerSectorFilter: '',
    errors: {
      details: 'mock_error',
    },
    filtered: '',
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

      expect(res.render).toHaveBeenCalledWith('pages/employers/employerList/index', {
        employerListResults: {
          content: [
            {
              name: 'mock_name',
              createdAt: 'mock_createdAt',
              status: 'mock_status',
            },
            {
              name: 'mock_name2',
              createdAt: 'mock_createdAt',
              status: 'mock_status',
            },
          ],
          totalElements: 2,
        },
        employerNameFilter: '',
        employerSectorFilter: '',
        filtered: '',
        order: 'descending',
        paginationData: {},
        sort: 'name',
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
      setSessionData(req, ['ciagList', 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/employers/employerList/index', {
        ...mockData,
        errors,
      })
    })

    it('On successful POST - call renders with the correct data', async () => {
      req.body.employerNameFilter = 'name1'
      req.body.employerSectorFilter = 'TEST_STATUS'

      controller.post(req, res, next)

      expect(getSessionData(req, ['ciagList', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `/?sort=name&order=descending&employerNameFilter=name1&employerSectorFilter=TEST_STATUS`,
      )
    })
  })
})
