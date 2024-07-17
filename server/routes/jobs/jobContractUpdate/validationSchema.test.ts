import BaseLocation from '../../../enums/baseLocation'
import ContractType from '../../../enums/contractType'
import Hours from '../../../enums/hours'
import SalaryPeriod from '../../../enums/salaryPeriod'
import WorkPattern from '../../../enums/workPattern'
import YesNoValue from '../../../enums/yesNoValue'
import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  beforeEach(() => {
    req.body.postcode = 'NE157LR'
    req.body.salaryFrom = '200'
    req.body.salaryTo = '400'
    req.body.salaryPeriod = SalaryPeriod.PER_DAY
    req.body.additionalSalaryInformation = 'Some text'
    req.body.nationalMinimumWage = YesNoValue.YES
    req.body.workPattern = WorkPattern.FLEXI_TIME
    req.body.contractType = ContractType.PERMANENT
    req.body.hours = Hours.FULL_TIME
    req.body.baseLocation = BaseLocation.WORKPLACE
  })

  it('On validation success - should allow all valid values', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a postcode being blank', () => {
    req.body.postcode = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter a job location')
  })

  it('On validation error - should disallow an invalid postcode', () => {
    req.body.postcode = 'dhajgdjahsgd'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job location must be a valid postcode')
  })

  it('On validation success - should allow all salaryFrom values upto 7 figures with 2 decimal places', () => {
    req.body.salaryFrom = '9999999.99'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a salaryFrom being blank', () => {
    req.body.salaryFrom = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter minimum salary amount')
  })

  it('On validation error - should disallow a salaryFrom being a non numeric value', () => {
    req.body.salaryFrom = 'abc'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Salary from must be a number')
  })

  it('On validation error - should disallow a salaryFrom a negative number', () => {
    req.body.salaryFrom = '-1'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Salary from must be a positive number')
  })

  it('On validation error - should disallow a salaryFrom from being more than 7 figures', () => {
    req.body.salaryFrom = '99999999'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Salary from must be 7 characters or less')
  })

  it('On validation error - should disallow a salaryFrom from having more than 2 decimal places', () => {
    req.body.salaryFrom = '9.999'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Number can only include a maximum of 2 characters after the decimal point')
  })

  it('On validation success - should allow all salaryTo values upto 7 figures with 2 decimal places', () => {
    req.body.salaryTo = '9999999.99'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow a salaryTo being blank', () => {
    req.body.salaryTo = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a salaryTo being a non numeric value', () => {
    req.body.salaryTo = 'abc'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Salary to must be a number')
  })

  it('On validation error - should disallow a salaryTo a negative number', () => {
    req.body.salaryTo = '-1'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Salary to must be a positive number')
  })

  it('On validation error - should disallow a salaryTo from being more than 7 figures', () => {
    req.body.salaryTo = '99999999'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Salary to must be 7 characters or less')
  })

  it('On validation error - should disallow a salaryTo from having more than 2 decimal places', () => {
    req.body.salaryTo = '9.999'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Number can only include a maximum of 2 characters after the decimal point')
  })

  it('On validation error - should disallow a salaryPeriod being blank', () => {
    req.body.salaryPeriod = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a salary period')
  })

  it('On validation error - should disallow a salaryPeriod being an invalid value', () => {
    req.body.salaryPeriod = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a salary period')
  })

  it('On validation error - should disallow a nationalMinimumWage being blank', () => {
    req.body.nationalMinimumWage = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select whether the job pays minimum wage or not')
  })

  it('On validation error - should disallow a nationalMinimumWage being an invalid value', () => {
    req.body.nationalMinimumWage = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select whether the job pays minimum wage or not')
  })

  it('On validation error - should disallow a workPattern being blank', () => {
    req.body.workPattern = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a work pattern')
  })

  it('On validation error - should disallow a workPattern being an invalid value', () => {
    req.body.workPattern = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a work pattern')
  })

  it('On validation error - should disallow a contractType being blank', () => {
    req.body.contractType = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a contract type')
  })

  it('On validation error - should disallow a contractType being an invalid value', () => {
    req.body.contractType = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select a contract type')
  })

  it('On validation error - should disallow a hours being blank', () => {
    req.body.hours = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select the hours for this job')
  })

  it('On validation error - should disallow a hours being an invalid value', () => {
    req.body.hours = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select the hours for this job')
  })

  it('On validation success - should allow a baseLocation being blank', () => {
    req.body.baseLocation = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a baseLocation being an invalid value', () => {
    req.body.baseLocation = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select the base location for this job')
  })

  it('On validation success - should allow a additionalSalaryInformation being blank', () => {
    req.body.additionalSalaryInformation = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow a additionalSalaryInformation with 100 characters', () => {
    req.body.additionalSalaryInformation = 'x'.repeat(100)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a additionalSalaryInformation longer than 100 characters', () => {
    req.body.additionalSalaryInformation = 'x'.repeat(101)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Additional salary information must be 100 characters or less')
  })
})
