import { override } from 'joi'
import filterJobsCreatedMyMe from './filterJobsCreatedByMe'
import GetJobListItemReaponse from '../data/jobApi/getJobListItemReaponse'

describe('#filterJobsCreatedByMe', () => {
  it('should return only jobs created by the given user', () => {
    const resultSet = {
      content: [
        { id: '1', createdBy: 'userA' } as any,
        { id: '2', createdBy: 'userB' } as any,
        { id: '3', createdBy: 'userA' } as any,
      ],
      page: { size: 10, number: 0, totalElements: 3, totalPages: 1 },
    }

    const result = filterJobsCreatedMyMe(resultSet, 'userA')

    expect(result.content).toHaveLength(2)
    expect(result.content.map(j => j.id)).toEqual(['1', '3'])
  })

  it('should return empty content if no jobs were created by the given user', () => {
    const resultSet = {
      content: [{ id: '1', createdBy: 'userX' } as any, { id: '2', createdBy: 'userY' } as any],
      page: { size: 5, number: 0, totalElements: 2, totalPages: 1 },
    }

    const result = filterJobsCreatedMyMe(resultSet, 'userZ')

    expect(result.content).toHaveLength(0)
    expect(result.page.totalElements).toBe(0)
    expect(result.page.totalPages).toBe(1) // note the || 1 safeguard
  })

  it('should reset page number to 0 regardless of input', () => {
    const resultSet = {
      content: [{ id: '1', createdBy: 'userA' }] as any,
      page: { size: 2, number: 5, totalElements: 10, totalPages: 5 },
    }

    const result = filterJobsCreatedMyMe(resultSet, 'userA')

    expect(result.page.number).toBe(0)
  })

  it('should calculate totalPages correctly when filtered results exceed page size', () => {
    const resultSet = {
      content: [
        { id: '1', createdBy: 'userA' } as any,
        { id: '2', createdBy: 'userA' } as any,
        { id: '3', createdBy: 'userA' } as any,
      ],
      page: { size: 2, number: 0, totalElements: 3, totalPages: 2 },
    }

    const result = filterJobsCreatedMyMe(resultSet, 'userA')

    expect(result.page.totalElements).toBe(3)
    expect(result.page.totalPages).toBe(2) // ceil(3/2) = 2
  })

  it('should handle an empty result set gracefully', () => {
    const resultSet = {
      content: [] as GetJobListItemReaponse[],
      page: { size: 5, number: 0, totalElements: 0, totalPages: 0 },
    }

    const result = filterJobsCreatedMyMe(resultSet, 'userA')

    expect(result.content).toEqual([])
    expect(result.page.totalElements).toBe(0)
    expect(result.page.totalPages).toBe(1) // fallback
  })
})
