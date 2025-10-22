import { format } from 'date-fns'
import parseBodyDateInput from './parseBodyDateInput'

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
