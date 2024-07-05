/* eslint-disable @typescript-eslint/no-explicit-any */
import HmppsAuthClient from '../data/hmppsAuthClient'
import EmployerService from './employerService'
import EmployerApiClient from '../data/employerApi/employerApiClient'
import EmployerSector from '../enums/employerSector'
import EmployerStatus from '../enums/employerStatus'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/employerApi/employerApiClient')
jest.mock('uuid', () => ({ v7: () => '123456789' }))

describe('employerService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let employerApiClient: jest.Mocked<EmployerApiClient>
  let employerService: EmployerService

  const employer = {
    employerName: 'mock_employerName',
    employerDescription: 'mock_employerDescription',
    employerSector: EmployerSector.CONSTRUCTION,
    employerStatus: EmployerStatus.GOLD,
  }

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    employerApiClient = {
      getEmployer: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      putEmployer: jest.fn().mockResolvedValue({ data: 'mock_data' }),
    } as unknown as jest.Mocked<EmployerApiClient>
    ;(EmployerApiClient as any).mockImplementation(() => employerApiClient)

    employerService = new EmployerService(hmppsAuthClientMock)
  })

  it('#getEmployer - should get token and call correct api method', async () => {
    const result = await employerService.getEmployer('user', 'id')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(employerApiClient.getEmployer).toHaveBeenCalledWith('id')
  })

  it('#createEmployer - should get token and call correct api method', async () => {
    const result = await employerService.createEmployer('user', {
      ...employer,
    })

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(employerApiClient.putEmployer).toHaveBeenCalledWith('123456789', {
      name: employer.employerName,
      sector: employer.employerSector as EmployerSector,
      status: employer.employerStatus as EmployerStatus,
      description: employer.employerDescription,
    })
  })

  it('#updateEmployer - should get token and call correct api method', async () => {
    const result = await employerService.updateEmployer('user', {
      employerId: '987654321',
      ...employer,
    })

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(employerApiClient.putEmployer).toHaveBeenCalledWith('987654321', {
      name: employer.employerName,
      sector: employer.employerSector as EmployerSector,
      status: employer.employerStatus as EmployerStatus,
      description: employer.employerDescription,
    })
  })
})
