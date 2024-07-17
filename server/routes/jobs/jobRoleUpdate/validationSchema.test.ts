import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  beforeEach(() => {
    req.body.employerId = 'test id'
    req.body.jobTitle = 'test job title'
    req.body.jobSector = 'OUTDOOR'
    req.body.industrySector = 'AGRICULTURE'
    req.body.numberOfVacancies = '2'
    req.body.jobSource = 'DWP'
    req.body.jobSource2 = 'EAB'
    req.body.charity = 'Test chrity'
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

  it('On validation error - should disallow a jobSector being blank', () => {
    req.body.jobSector = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job sector')
  })

  it('On validation error - should disallow a jobSector being an invalid value', () => {
    req.body.jobSector = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job sector')
  })

  it('On validation error - should disallow a industrySector being blank', () => {
    req.body.industrySector = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an NFN industry sector')
  })

  it('On validation error - should disallow a industrySector being an invalid value', () => {
    req.body.industrySector = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an NFN industry sector')
  })

  it('On validation error - should disallow a jobSource being blank', () => {
    req.body.jobSource = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job source')
  })

  it('On validation error - should disallow a jobSource being an invalid value', () => {
    req.body.jobSource = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job source')
  })

  it('On validation success - should allow a jobSource2 being blank', () => {
    req.body.jobSource2 = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a jobSource2 being an invalid value', () => {
    req.body.jobSource2 = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a job source')
  })

  it('On validation error - should allow a charity being blank', () => {
    req.body.charity = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow a charity with 100 characters', () => {
    req.body.charity = 'x'.repeat(100)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a charity longer than 100 characters', () => {
    req.body.charity = 'x'.repeat(101)

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
})
