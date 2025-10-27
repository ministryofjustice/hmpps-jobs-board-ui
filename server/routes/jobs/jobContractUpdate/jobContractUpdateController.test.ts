/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from './jobContractUpdateController'
import expressMocks from '../../../testutils/expressMocks'
import validateFormSchema from '../../../utils/validateFormSchema'
import { deleteSessionData, setSessionData } from '../../../utils/session'
import addressLookup from '../../addressLookup'
import SalaryPeriod from '../../../enums/salaryPeriod'
import YesNoValue from '../../../enums/yesNoValue'
import WorkPattern from '../../../enums/workPattern'
import ContractType from '../../../enums/contractType'
import Hours from '../../../enums/hours'
import BaseLocation from '../../../enums/baseLocation'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('jobContractUpdateController', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'MOCK_USER' }

  req.params.id = 'new'
  req.params.mode = 'add'
  const { id, mode } = req.params

  const mockData = {
    id,
    mode,
    backLocation: '/jobs/job/new/role/add',
    postCode: '',
    errors: null as any,
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    const errors = { details: 'mock_error' }
    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['job', id], {})
      req.params.mode = 'add'
      validationMock.mockReset()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On validation error - Calls render with correct data', async () => {
      req.params.mode = 'update'
      setSessionData(req, ['job', id], mockData)
      validationMock.mockImplementation(() => errors)
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobContractUpdate/index', {
        ...mockData,
        errors,
      })
    })

    it('On success - If no job redirects to jobRoleUpdate', async () => {
      deleteSessionData(req, ['job', id])

      controller.get(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.jobs.jobRoleUpdate(id))
    })

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobContractUpdate/index', {
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
      setSessionData(req, ['jobContractUpdate', id], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/jobs/jobContractUpdate/index', {
        ...mockData,
        errors,
      })
    })

    it('On success - Sets session and redirects to jobRequirementsUpdate', async () => {
      req.body.postCode = 'NE157LR'
      req.body.salaryFrom = '200'
      req.body.salaryTo = '400'
      req.body.salaryPeriod = SalaryPeriod.PER_DAY
      req.body.additionalSalaryInformation = 'Some text'
      req.body.isPayingAtLeastNationalMinimumWage = YesNoValue.YES
      req.body.workPattern = WorkPattern.FLEXI_TIME
      req.body.contractType = ContractType.PERMANENT
      req.body.hoursPerWeek = Hours.FULL_TIME
      req.body.baseLocation = BaseLocation.WORKPLACE

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.jobs.jobRequirementsUpdate(id))
    })
  })
})
