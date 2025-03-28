import OffenceExclusions from '../../../enums/offenceExclusions'
import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  beforeEach(() => {
    req.body.essentialCriteria = 'Some text'
    req.body.desirableCriteria = 'Some text'
    req.body.description = 'Some text'
    req.body.offenceExclusions = [OffenceExclusions.CASE_BY_CASE]
  })

  it('On validation success - should allow all valid values', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow a essentialCriteria with 1000 characters', () => {
    req.body.essentialCriteria = 'x'.repeat(1000)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a essentialCriteria being blank', () => {
    req.body.essentialCriteria = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter essential job requirements')
  })

  it('On validation error - should disallow a essentialCriteria longer than 1000 characters', () => {
    req.body.essentialCriteria = 'x'.repeat(1001)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Essential requirements must be 1000 characters or less')
  })

  it('On validation success - should allow a desirableCriteria with 1000 characters', () => {
    req.body.desirableCriteria = 'x'.repeat(1000)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should allow a desirableCriteria being blank', () => {
    req.body.desirableCriteria = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a desirableCriteria longer than 1000 characters', () => {
    req.body.desirableCriteria = 'x'.repeat(1001)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Desirable requirements must be 1000 characters or less')
  })

  it('On validation success - should allow a description with 3000 characters', () => {
    req.body.description = 'x'.repeat(3000)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a description being blank', () => {
    req.body.description = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter job description')
  })

  it('On validation error - should disallow a description longer than 3000 characters', () => {
    req.body.description = 'x'.repeat(3001)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job description must be 3000 characters or less')
  })

  it('On validation error - should disallow a offenceExclusions being blank', () => {
    req.body.offenceExclusions = undefined

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select one or more options in offence exclusions')
  })

  it('On validation success - should all a offenceExclusionsDetails if offenceExclusions includes OTHER', () => {
    req.body.offenceExclusions = ['NONE', 'OTHER']
    req.body.offenceExclusionsDetails = 'Some text'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a offenceExclusionsDetails being blank if offenceExclusions includes OTHER', () => {
    req.body.offenceExclusions = ['NONE', 'OTHER']
    req.body.offenceExclusionsDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter details of the other offence exclusions')
  })

  it('On validation error - should disallow a offenceExclusionsDetails longer than 100 characters', () => {
    req.body.offenceExclusions = ['NONE', 'OTHER']
    req.body.offenceExclusionsDetails = 'x'.repeat(501)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe("'Other exclusions' must be 100 characters or less")
  })

  it('On validation error - should disallow a offenceExclusionsDetails shorter than 3 characters', () => {
    req.body.offenceExclusions = ['NONE', 'OTHER']
    req.body.offenceExclusionsDetails = 'xx'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe("'Other exclusions' must be 3 characters or more")
  })

  it('On validation error - should disallow a offenceExclusionsDetails containing punctuation', () => {
    req.body.offenceExclusions = ['NONE', 'OTHER']
    req.body.offenceExclusionsDetails = 'Some text, Some text'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe("'Other exclusions' can only include letters, numbers and spaces")
  })
})
