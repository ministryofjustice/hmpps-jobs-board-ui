import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  beforeEach(() => {
    req.body.employerId = 'test id'
    req.body.jobTitle = 'test job title'
    req.body.sector = 'OUTDOOR'
    req.body.industrySector = 'AGRICULTURE'
    req.body.numberOfVacancies = '2'
    req.body.sourcePrimary = 'DWP'
    req.body.sourceSecondary = 'EAB'
    req.body.charityName = 'Test chrity'
  })

  it('On validation success - should allow all valid values', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a employerId being blank', () => {
    req.body.employerId = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe("Select employer or select 'Add an employer'")
  })

  it('On validation success - should allow a jobTitle with 50 characters', () => {
    req.body.jobTitle = 'x'.repeat(50)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a jobTitle being blank', () => {
    req.body.jobTitle = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job title must be 3 characters or more')
  })

  it('On validation error - should disallow a jobTitle longer than 50 characters', () => {
    req.body.jobTitle = 'x'.repeat(51)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job title must be 50 characters or less')
  })

  it('On validation error - should disallow a sector being blank', () => {
    req.body.sector = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job sector')
  })

  it('On validation error - should disallow a sector being an invalid value', () => {
    req.body.sector = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job sector')
  })

  it('On validation error - should disallow a industrySector being blank', () => {
    req.body.industrySector = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an HMPPS reporting industry sector')
  })

  it('On validation error - should disallow a industrySector being an invalid value', () => {
    req.body.industrySector = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an HMPPS reporting industry sector')
  })

  it('On validation error - should disallow a sourcePrimary being blank', () => {
    req.body.sourcePrimary = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job source')
  })

  it('On validation error - should disallow a sourcePrimary being an invalid value', () => {
    req.body.sourcePrimary = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job source')
  })

  it('On validation success - should allow a sourceSecondary being blank', () => {
    req.body.sourceSecondary = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a sourceSecondary being an invalid value', () => {
    req.body.sourceSecondary = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job source')
  })

  it('On validation error - should allow a charityName being blank', () => {
    req.body.charityName = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow a charityName with 100 characters', () => {
    req.body.charityName = 'x'.repeat(100)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a charityName longer than 100 characters', () => {
    req.body.charityName = 'x'.repeat(101)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Charity must be 100 characters or less')
  })

  it('On validation error - should disallow a numberOfVacancies being blank', () => {
    req.body.numberOfVacancies = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter number of vacancies')
  })

  it('On validation error - should disallow a numberOfVacancies not being a number', () => {
    req.body.numberOfVacancies = 'asdsaa'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Number of vacancies must be a number')
  })

  it('On validation error - should disallow a numberOfVacancies not being a positive number', () => {
    req.body.numberOfVacancies = '-1'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Number of vacancies must be a positive number')
  })
})
