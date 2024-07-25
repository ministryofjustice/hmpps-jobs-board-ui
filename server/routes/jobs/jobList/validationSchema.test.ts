import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const longStr = 'x'.repeat(51)
  const schema = validationSchema()

  it('On validation success - should allow a jobTitleOrEmployerNameFilter with 50 characters', () => {
    req.body.jobTitleOrEmployerNameFilter = 'x'.repeat(50)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a jobTitleOrEmployerNameFilter longer than 50 characters', () => {
    req.body.jobTitleOrEmployerNameFilter = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job title or employer name must be 50 characters or less')
  })

  it('On validation error - should disallow a jobTitleOrEmployerNameFilter less than 3 characters', () => {
    req.body.jobTitleOrEmployerNameFilter = 'x'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job title or employer name must be 3 characters or more')
  })

  it('On validation success - should allow a jobTitleOrEmployerNameFilter with 50 characters', () => {
    req.body.jobTitleOrEmployerNameFilter = 'x'.repeat(5)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
