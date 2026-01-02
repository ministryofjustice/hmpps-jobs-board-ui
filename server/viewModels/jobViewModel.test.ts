import { plainToClass, plainToInstance } from 'class-transformer'
import JobViewModel from './jobViewModel'
import JobSector from '../enums/jobSector'
import JobStatus from '../enums/jobStatus'

const baseData = {
  id: '123',
  jobTitle: 'Software Engineer',
  employerName: 'Tech Corp',
  createdAt: '2024-07-04T10:00:00.000Z',
  createdBy: 'USER1',
  sector: JobSector.BEAUTY,
  numberOfVacancies: 2,
  closingDate: '2026-07-04T10:00:00.000Z',
}

describe('JobViewModel', () => {
  it('should expose only specified properties', () => {
    const job = plainToClass(JobViewModel, baseData)
    expect(Object.keys(job)).toEqual([
      'id',
      'jobTitle',
      'employerName',
      'createdAt',
      'createdBy',
      'sector',
      'numberOfVacancies',
      'isRollingOpportunity',
      'closingDate',
    ])
  })

  it('should format createdAt using formatDateStringTodMMMyyyy', () => {
    const job = plainToClass(JobViewModel, baseData)
    expect(job.createdAt).toEqual('4 Jul 2024')
  })

  it('should keep raw closingDate as Date', () => {
    const job = plainToClass(JobViewModel, {
      ...baseData,
      closingDate: '2024-08-01T00:00:00.000Z',
    })

    expect(job.closingDate).toBeInstanceOf(Date)
  })

  it('should format closingDate using formatDateStringTodMMMyyyy', () => {
    const job = plainToInstance(
      JobViewModel,
      {
        ...baseData,
        closingDate: '2024-08-01T00:00:00.000Z',
      },
      { enableImplicitConversion: true },
    )
    expect(job.formattedClosingDate).toBe('1 Aug 2024')
  })

  it('should return LIVE status if closingDate is not set', () => {
    const job = plainToClass(JobViewModel, baseData)
    expect(job.jobStatus).toBe(JobStatus.LIVE)
  })

  it('should return CLOSED status if closingDate is in the past and isRollingOpportunity is false', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 10)
    const job = plainToClass(JobViewModel, {
      ...baseData,
      closingDate: pastDate.toISOString(),
      isRollingOpportunity: false,
    })
    expect(job.jobStatus).toBe(JobStatus.CLOSED)
  })

  it('should return LIVE status if closingDate is in the future and isRollingOpportunity is false', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 10)
    const job = plainToClass(JobViewModel, {
      ...baseData,
      closingDate: futureDate.toISOString(),
      isRollingOpportunity: false,
    })
    expect(job.jobStatus).toBe(JobStatus.LIVE)
  })

  it('should return LIVE status when closingDate is undefined and isRollingOpportunity is true', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 10)
    const job = plainToClass(JobViewModel, {
      ...baseData,
      isRollingOpportunity: true,
    })
    expect(job.jobStatus).toBe(JobStatus.LIVE)
  })
})
