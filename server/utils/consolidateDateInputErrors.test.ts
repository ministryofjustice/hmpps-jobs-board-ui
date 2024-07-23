/* eslint-disable @typescript-eslint/no-explicit-any */
import consolidateDateInputErrors from './consolidateDateInputErrors'
import { FormValidationErrors } from './validateFormSchema'

describe('consolidateDateInputErrors', () => {
  let req: { body: { [x: string]: unknown } }
  let errors: FormValidationErrors
  const fieldName = 'startDate'

  beforeEach(() => {
    req = { body: {} }
    errors = {}
  })

  it('should consolidate date input errors and update req.body', () => {
    req.body['startDate-day'] = '15'
    req.body['startDate-month'] = '7'
    req.body['startDate-year'] = '2023'

    errors['startDate-day'] = 'Day error' as any
    errors['startDate-month'] = 'Month error' as any
    errors['startDate-year'] = 'Year error' as any

    consolidateDateInputErrors(req, errors, fieldName)

    expect(errors.startDate).toBe('Day error')
    expect(req.body.startDate).toEqual({
      'startDate-day': '15',
      'startDate-day-error': 'Day error',
      'startDate-month': '7',
      'startDate-month-error': 'Month error',
      'startDate-year': '2023',
      'startDate-year-error': 'Year error',
    })

    expect(errors['startDate-day']).toBeUndefined()
    expect(errors['startDate-month']).toBeUndefined()
    expect(errors['startDate-year']).toBeUndefined()
  })

  it('should consolidate errors only if there are individual date part errors', () => {
    req.body['startDate-day'] = '15'
    req.body['startDate-month'] = '7'
    req.body['startDate-year'] = '2023'

    errors['startDate-day'] = 'Day error' as any

    consolidateDateInputErrors(req, errors, fieldName)

    expect(errors.startDate).toBe('Day error')
    expect(req.body.startDate).toEqual({
      'startDate-day': '15',
      'startDate-day-error': 'Day error',
      'startDate-month': '7',
      'startDate-month-error': undefined,
      'startDate-year': '2023',
      'startDate-year-error': undefined,
    })

    expect(errors['startDate-day']).toBeUndefined()
    expect(errors['startDate-month']).toBeUndefined()
    expect(errors['startDate-year']).toBeUndefined()
  })

  it('should not update req.body if there are no individual date part errors', () => {
    req.body['startDate-day'] = '15'
    req.body['startDate-month'] = '7'
    req.body['startDate-year'] = '2023'

    consolidateDateInputErrors(req, errors, fieldName)

    expect(errors.startDate).toBeUndefined()
    expect(req.body.startDate).toEqual({
      'startDate-day': '15',
      'startDate-day-error': undefined,
      'startDate-month': '7',
      'startDate-month-error': undefined,
      'startDate-year': '2023',
      'startDate-year-error': undefined,
    })
  })
})
