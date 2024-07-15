import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const longStr = 'x'.repeat(201)
  const schema = validationSchema()

  it('On validation success - should allow a employerNameFilter with 200 characters', () => {
    req.body.employerNameFilter = 'x'.repeat(200)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a employerNameFilter longer than 200 characters', () => {
    req.body.employerNameFilter = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Employer name must be 200 characters or less')
  })
  it('On validation success - should allow a employerNameFilter with 200 characters', () => {
    req.body.employerNameFilter = 'xx'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
