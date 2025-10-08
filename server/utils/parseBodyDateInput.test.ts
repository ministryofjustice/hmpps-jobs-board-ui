import { format } from 'date-fns'
import parseBodyDateInput, { parseDateStringToBodyFields } from './parseBodyDateInput'

describe('parseBodyDateInput', () => {
  let req: { body: { [x: string]: number } }

  beforeEach(() => {
    req = { body: {} }
  })

  it('should return an ISO string when all date parts are provided', () => {
    req.body['startDate-day'] = 15
    req.body['startDate-month'] = 7
    req.body['startDate-year'] = 2023

    const result = parseBodyDateInput(req, 'startDate')
    const expectedDate = format(new Date(2023, 6, 15), 'yyyy-MM-dd') // Months are 0-based, so 7 - 1 = 6

    expect(result).toBe(expectedDate)
  })

  it('should return falsy when day part is missing', () => {
    req.body['startDate-month'] = 7
    req.body['startDate-year'] = 2023

    const result = parseBodyDateInput(req, 'startDate')

    expect(result).toBeFalsy()
  })

  it('should return falsy when month part is missing', () => {
    req.body['startDate-day'] = 15
    req.body['startDate-year'] = 2023

    const result = parseBodyDateInput(req, 'startDate')

    expect(result).toBeFalsy()
  })

  it('should return falsy when year part is missing', () => {
    req.body['startDate-day'] = 15
    req.body['startDate-month'] = 7

    const result = parseBodyDateInput(req, 'startDate')

    expect(result).toBeFalsy()
  })

  it('should return falsy when all date parts are missing', () => {
    const result = parseBodyDateInput(req, 'startDate')

    expect(result).toBeFalsy()
  })
})

describe('parseDateStringToBodyFields', () => {
  let dateString: string | null

  it('should return all date parts when an ISO date string is provided', () => {
    dateString = '2023-07-17'

    const result = parseDateStringToBodyFields(dateString, 'startDate')

    expect(result).toEqual({
      'startDate-year': 2023,
      'startDate-month': 7,
      'startDate-day': 17,
    })
  })

  it('should return empty strings for all date parts when date string is null', () => {
    dateString = null

    const result = parseDateStringToBodyFields(dateString, 'startDate')

    expect(result).toEqual({
      'startDate-year': '',
      'startDate-month': '',
      'startDate-day': '',
    })
  })

  it('should return empty strings for all date parts when date string is empty', () => {
    dateString = ''

    const result = parseDateStringToBodyFields(dateString, 'closingDate')

    expect(result).toEqual({
      'closingDate-year': '',
      'closingDate-month': '',
      'closingDate-day': '',
    })
  })
})
