/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import expressMocks from '../../../testutils/expressMocks'
import Controller, { getJobStatusSortKey } from './jobListController'
import validateFormSchema from '../../../utils/validateFormSchema'
import { getSessionData, setSessionData } from '../../../utils/session'
import JobViewModel from '../../../viewModels/jobViewModel'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

const today = new Date()

const daysFromToday = (days: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

type RenderedJobListData = {
  jobListResults: {
    content: JobViewModel[]
    page?: {
      totalElements: number
    }
  }
  sort: string
  order: string
}

function getRenderedData(res: any): RenderedJobListData {
  return (res.render as jest.Mock).mock.calls[0][1] as RenderedJobListData
}

const jobsForSorting = [
  {
    id: '1',
    jobTitle: 'Live no closing date',
    closingDate: null,
    isRollingOpportunity: false,
  },
  {
    id: '2',
    jobTitle: 'Closed job',
    closingDate: daysFromToday(-5),
    isRollingOpportunity: false,
  },
  {
    id: '3',
    jobTitle: 'Live future closing',
    closingDate: daysFromToday(10),
    isRollingOpportunity: false,
  },
  {
    id: '4',
    jobTitle: 'Rolling job',
    closingDate: daysFromToday(-100),
    isRollingOpportunity: true,
  },
]

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

    it('On success - sorts jobs by jobStatus ascending (LIVE first)', async () => {
      req.context.jobs = {
        content: jobsForSorting,
        page: { totalElements: jobsForSorting.length },
      }

      req.query.sort = 'jobStatus'
      req.query.order = 'ascending'

      await controller.get(req, res, next)

      const renderedData = getRenderedData(res)
      const titles = renderedData.jobListResults.content.map(j => j.jobTitle)

      expect(renderedData.sort).toBe('jobStatus')
      expect(renderedData.order).toBe('ascending')
      expect(titles[0]).toBe('Rolling job')
      expect(renderedData.jobListResults.content.length).toBe(jobsForSorting.length)
      expect(renderedData.jobListResults.content[0]).toBeInstanceOf(JobViewModel)
      expect(titles).toEqual(['Rolling job', 'Live future closing', 'Live no closing date', 'Closed job'])
    })

    it('On success - sorts jobs by jobStatus descending (CLOSED first)', async () => {
      req.context.jobs = {
        content: jobsForSorting,
        page: { totalElements: jobsForSorting.length },
      }

      req.query.sort = 'jobStatus'
      req.query.order = 'descending'

      await controller.get(req, res, next)

      const renderedData = getRenderedData(res)
      const titles = renderedData.jobListResults.content.map(j => j.jobTitle)

      expect(titles[0]).toBe('Closed job')
    })

    it('On success - secondary sorts LIVE jobs by closingDate ascending', async () => {
      const jobs = [
        {
          id: '1',
          jobTitle: 'Live later',
          closingDate: daysFromToday(20),
        },
        {
          id: '2',
          jobTitle: 'Live sooner',
          closingDate: daysFromToday(5),
        },
      ]

      req.context.jobs = {
        content: jobs,
        page: { totalElements: 2 },
      }

      req.query.sort = 'jobStatus'
      req.query.order = 'ascending'

      await controller.get(req, res, next)

      const renderedData = getRenderedData(res)
      const titles = renderedData.jobListResults.content.map(j => j.jobTitle)

      expect(titles).toEqual(['Live sooner', 'Live later'])
    })

    it('On success - does not apply jobStatus sorting when sort is not jobStatus', async () => {
      req.context.jobs = {
        content: [...jobsForSorting],
        page: { totalElements: jobsForSorting.length },
      }

      req.query.sort = 'jobTitle'
      req.query.order = 'ascending'

      await controller.get(req, res, next)

      const renderedData = getRenderedData(res)
      const titles = renderedData.jobListResults.content.map(j => j.jobTitle)

      expect(titles).toEqual(jobsForSorting.map(j => j.jobTitle))
    })

    it('On success - does not mutate req.context.jobs.content', async () => {
      const original = [...jobsForSorting]

      req.context.jobs = {
        content: original,
        page: { totalElements: original.length },
      }

      req.query.sort = 'jobStatus'
      req.query.order = 'ascending'

      await controller.get(req, res, next)

      expect(req.context.jobs.content).toEqual(original)
    })

    it('On success - treats rolling or missing closingDate jobs as LIVE', async () => {
      req.query.sort = 'jobStatus'
      req.query.order = 'ascending'

      const jobs = [
        {
          id: '1',
          jobTitle: 'Closed job',
          closingDate: daysFromToday(-5),
          isRollingOpportunity: false,
        },
        {
          id: '2',
          jobTitle: 'No closing date - LIVE',
          closingDate: null,
          isRollingOpportunity: false,
        },
        {
          id: '3',
          jobTitle: 'Rolling job - LIVE',
          closingDate: daysFromToday(10),
          isRollingOpportunity: true,
        },
      ]
      req.context.jobs.content = jobs

      await controller.get(req, res, next)

      const renderedData = getRenderedData(res)
      const statuses = renderedData.jobListResults.content.map(j => j.jobStatus)

      expect(statuses).toEqual(['LIVE', 'LIVE', 'CLOSED'])
    })

    it('Test pagination service - should not be called with only 1 record', async () => {
      req.query.sort = 'jobStatus'
      req.query.order = 'ascending'

      await controller.get(req, res, next)

      expect(mockPaginationService.getPagination).not.toHaveBeenCalled()
    })

    it('Passes unsorted paged response to pagination service', async () => {
      req.query.sort = 'jobStatus'
      req.query.order = 'ascending'

      req.context.jobs = {
        content: new Array(25).fill(null).map((_, i) => ({
          id: `job-${i}`,
          jobTitle: `Job ${i}`,
          closingDate: '2099-01-01',
          isRollingOpportunity: false,
        })),
        page: {
          totalElements: 25,
        },
      }

      await controller.get(req, res, next)

      const [[paginationArg]] = mockPaginationService.getPagination.mock.calls
      expect(mockPaginationService.getPagination).toHaveBeenCalled()
      expect(paginationArg.page.totalElements).toBe(25)
    })
  })

  describe('getJobStatusSortKey', () => {
    it('On success - returns LIVE for rolling job', () => {
      expect(getJobStatusSortKey({ isRollingOpportunity: true })).toBe(0)
    })

    it('On success - returns CLOSED for past closing date', () => {
      expect(getJobStatusSortKey({ closingDate: daysFromToday(-1) })).toBe(1)
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }
    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      req.query.sort = 'name'
      req.query.order = 'descending'
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
