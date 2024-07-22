import expressMocks from '../testutils/expressMocks'
import parseDateInputValue from './parseDateInputValue'

describe('parseDateInputValue middleware', () => {
  const { req, res, next } = expressMocks()

  const parseDateInput = parseDateInputValue('testDate')

  it('should consolidate day, month, and year into a single field object', async () => {
    req.body['testDate-day'] = 15
    req.body['testDate-month'] = 7
    req.body['testDate-year'] = 2023

    parseDateInput(req, res, next)

    expect(req.body.testDate).toEqual({
      'testDate-day': 15,
      'testDate-month': 7,
      'testDate-year': 2023,
    })
    expect(next).toHaveBeenCalledWith()
  })

  it('should handle missing date parts and include them as undefined', async () => {
    req.body['testDate-day'] = 15
    req.body['testDate-month'] = 7
    req.body['testDate-year'] = undefined

    parseDateInput(req, res, next)

    expect(req.body.testDate).toEqual({
      'testDate-day': 15,
      'testDate-month': 7,
      'testDate-year': undefined,
    })
    expect(next).toHaveBeenCalledWith()
  })

  it('should handle all fields being undefined', async () => {
    req.body['testDate-day'] = undefined
    req.body['testDate-month'] = undefined
    req.body['testDate-year'] = undefined

    parseDateInput(req, res, next)

    expect(req.body.testDate).toEqual({
      'testDate-day': undefined,
      'testDate-month': undefined,
      'testDate-year': undefined,
    })
    expect(next).toHaveBeenCalledWith()
  })
})
