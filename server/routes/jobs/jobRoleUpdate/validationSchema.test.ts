import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  it('On validation success - should allow a jobTitle with 100 characters', () => {
    req.body.jobTitle = 'x'.repeat(100)
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a jobTitle being blank', () => {
    req.body.jobTitle = ''
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job title must be 3 characters or more')
  })

  it('On validation error - should disallow a jobTitle longer than 100 characters', () => {
    req.body.jobTitle = 'x'.repeat(101)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job title must be 100 characters or less')
  })
})
