import EmployerSector from '../../../enums/employerSector'
import EmployerStatus from '../../../enums/employerStatus'
import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const longStr = 'x'.repeat(1001)
  const schema = validationSchema()

  it('On validation success - should allow a employerDescription with 100 characters', () => {
    req.body.employerName = 'x'.repeat(100)
    req.body.employerSector = EmployerSector.MINING
    req.body.employerStatus = EmployerStatus.KEY_PARTNER
    req.body.employerDescription = 'Some_value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a employerDescription being blank', () => {
    req.body.employerName = ''
    req.body.employerSector = EmployerSector.MINING
    req.body.employerStatus = EmployerStatus.KEY_PARTNER
    req.body.employerDescription = 'Some_value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Employer name must be 3 characters or more')
  })

  it('On validation error - should disallow a employerName longer than 100 characters', () => {
    req.body.employerName = 'x'.repeat(101)
    req.body.employerSector = EmployerSector.MINING
    req.body.employerStatus = EmployerStatus.KEY_PARTNER
    req.body.employerDescription = 'Some_value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Employer name must be 100 characters or less')
  })

  it('On validation success - should allow a employerDescription with 1000 characters', () => {
    req.body.employerName = 'Mock_name'
    req.body.employerSector = EmployerSector.MINING
    req.body.employerStatus = EmployerStatus.KEY_PARTNER
    req.body.employerDescription = 'x'.repeat(1000)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a employerDescription being blank', () => {
    req.body.employerName = 'Mock_name'
    req.body.employerSector = EmployerSector.MINING
    req.body.employerStatus = EmployerStatus.KEY_PARTNER
    req.body.employerDescription = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter employer description details')
  })

  it('On validation error - should disallow a employerDescription longer than 1000 characters', () => {
    req.body.employerName = 'Mock_name'
    req.body.employerSector = EmployerSector.MINING
    req.body.employerStatus = EmployerStatus.KEY_PARTNER
    req.body.employerDescription = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Employer Description must be 1000 characters or less')
  })

  it('On validation error - should disallow a employerStatus being blank', () => {
    req.body.employerName = 'Mock_name'
    req.body.employerSector = EmployerSector.MINING
    req.body.employerStatus = ''
    req.body.employerDescription = 'Some text'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an employer status')
  })

  it('On validation error - should disallow a employerStatus being non EmployerSector value', () => {
    req.body.employerName = 'Mock_name'
    req.body.employerSector = EmployerSector.MINING
    req.body.employerStatus = 'SOME_VALUE'
    req.body.employerDescription = 'Some text'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an employer status')
  })

  it('On validation error - should disallow a employerSector being blank', () => {
    req.body.employerName = 'Mock_name'
    req.body.employerSector = ''
    req.body.employerStatus = EmployerStatus.KEY_PARTNER
    req.body.employerDescription = 'Some text'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an employer sector')
  })

  it('On validation error - should disallow a employerStatus being non EmployerSector value', () => {
    req.body.employerName = 'Mock_name'
    req.body.employerSector = 'SOME_VALUE'
    req.body.employerStatus = EmployerStatus.KEY_PARTNER
    req.body.employerDescription = 'Some text'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an employer sector')
  })
})
