import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  beforeEach(() => {
    req.body.isRollingOpportunity = 'YES'
    req.body.isOnlyForPrisonLeavers = 'YES'
    req.body.howToApply = 'Some text'
    req.body.supportingDocumentationRequired = ['CV']
    req.body.supportingDocumentationDetails = ''
    req.body.startDate = {
      'startDate-day': '1',
      'startDate-month': '1',
      'startDate-year': '2024',
    }
    req.body.closingDate = {
      'closingDate-day': '',
      'closingDate-month': '',
      'closingDate-year': '',
    }
  })

  it('On validation success - should allow all valid values', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow a supportingDocumentationDetails with 200 characters', () => {
    req.body.supportingDocumentationRequired = ['OTHER']
    req.body.supportingDocumentationDetails = 'x'.repeat(200)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow a supportingDocumentationDetails being blank', () => {
    req.body.supportingDocumentationRequired = ['OTHER']
    req.body.supportingDocumentationDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a supportingDocumentationDetails longer than 200 characters', () => {
    req.body.supportingDocumentationRequired = ['OTHER']
    req.body.supportingDocumentationDetails = 'x'.repeat(201)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Other supporting documentation must be 200 characters or less')
  })

  it('On validation error - should disallow a isOnlyForPrisonLeavers being blank', () => {
    req.body.isOnlyForPrisonLeavers = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an answer to whether this job is only for prison leavers')
  })

  it('On validation error - should disallow a isOnlyForPrisonLeavers being an invalid value', () => {
    req.body.isOnlyForPrisonLeavers = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select an answer to whether this job is only for prison leavers')
  })

  it('On validation error - should disallow a isRollingOpportunity being blank', () => {
    req.body.isRollingOpportunity = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select whether the job is a rolling opportunity or not')
  })

  it('On validation error - should disallow a isRollingOpportunity being an invalid value', () => {
    req.body.isRollingOpportunity = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select whether the job is a rolling opportunity or not')
  })

  it('On validation success - should allow a howToApply with 1000 characters', () => {
    req.body.howToApply = 'x'.repeat(1000)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a howToApply being blank', () => {
    req.body.howToApply = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter how to apply details')
  })

  it('On validation error - should disallow a howToApply longer than 1000 characters', () => {
    req.body.howToApply = 'x'.repeat(1001)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('How to apply must be 1000 characters or less')
  })

  it('On validation error - should disallow a startDate day being blank', () => {
    req.body.startDate = {
      'startDate-day': '',
      'startDate-month': '1',
      'startDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Start date must include a day, month and year')
  })

  it('On validation error - should disallow a startDate day being less than 1', () => {
    req.body.startDate = {
      'startDate-day': '0',
      'startDate-month': '1',
      'startDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Day must be at least 1')
  })

  it('On validation error - should disallow a startDate day being more than 31', () => {
    req.body.startDate = {
      'startDate-day': '32',
      'startDate-month': '1',
      'startDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Day must be at most 31')
  })

  it('On validation error - should disallow a startDate day being non numeric', () => {
    req.body.startDate = {
      'startDate-day': 'a',
      'startDate-month': '1',
      'startDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Day must be a number')
  })

  it('On validation error - should disallow a startDate month being blank', () => {
    req.body.startDate = {
      'startDate-day': '1',
      'startDate-month': '',
      'startDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Start date must include a day, month and year')
  })

  it('On validation error - should disallow a startDate month being less than 1', () => {
    req.body.startDate = {
      'startDate-day': '1',
      'startDate-month': '0',
      'startDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Month must be at least 1')
  })

  it('On validation error - should disallow a startDate month being more than 12', () => {
    req.body.startDate = {
      'startDate-day': '1',
      'startDate-month': '13',
      'startDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Month must be at most 12')
  })

  it('On validation error - should disallow a startDate month being a non numeric value', () => {
    req.body.startDate = {
      'startDate-day': '1',
      'startDate-month': 'a',
      'startDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Month must be a number')
  })

  it('On validation error - should disallow a startDate year being blank', () => {
    req.body.startDate = {
      'startDate-day': '1',
      'startDate-month': '1',
      'startDate-year': '',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Start date must include a day, month and year')
  })

  it('On validation error - should disallow a startDate month being less than 1', () => {
    req.body.startDate = {
      'startDate-day': '1',
      'startDate-month': '1',
      'startDate-year': '0',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Year must be at least 1900')
  })

  it('On validation error - should disallow a startDate month being more than 12', () => {
    req.body.startDate = {
      'startDate-day': '1',
      'startDate-month': '1',
      'startDate-year': '3000',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Year must be at most 2100')
  })

  it('On validation error - should disallow a startDate month being a non numeric value', () => {
    req.body.startDate = {
      'startDate-day': '1',
      'startDate-month': '1',
      'startDate-year': 'a',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Year must be a number')
  })

  it('On validation error - should disallow a startDate must be a valid date', () => {
    req.body.startDate = {
      'startDate-day': '31',
      'startDate-month': '2',
      'startDate-year': '1971',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Start date must be a real date')
  })

  it('On validation error - should disallow a closingDate being blank if isRollingOpportunity = NO', () => {
    req.body.isRollingOpportunity = 'NO'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter a closing date')
  })

  it('On validation error - should disallow a closingDate day being blank', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '',
      'closingDate-month': '1',
      'closingDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Closing date must include a day, month and year')
  })

  it('On validation error - should disallow a closingDate day being less than 1', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '0',
      'closingDate-month': '1',
      'closingDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Day must be at least 1')
  })

  it('On validation error - should disallow a closingDate day being more than 31', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '32',
      'closingDate-month': '1',
      'closingDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Day must be at most 31')
  })

  it('On validation error - should disallow a closingDate day being non numeric', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': 'a',
      'closingDate-month': '1',
      'closingDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Day must be a number')
  })

  it('On validation error - should disallow a closingDate month being blank', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '1',
      'closingDate-month': '',
      'closingDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Closing date must include a day, month and year')
  })

  it('On validation error - should disallow a closingDate month being less than 1', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '1',
      'closingDate-month': '0',
      'closingDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Month must be at least 1')
  })

  it('On validation error - should disallow a closingDate month being more than 12', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '1',
      'closingDate-month': '13',
      'closingDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Month must be at most 12')
  })

  it('On validation error - should disallow a closingDate month being a non numeric value', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '1',
      'closingDate-month': 'a',
      'closingDate-year': '2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Month must be a number')
  })

  it('On validation error - should disallow a closingDate year being blank', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '1',
      'closingDate-month': '1',
      'closingDate-year': '',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Closing date must include a day, month and year')
  })

  it('On validation error - should disallow a closingDate month being less than 1', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '1',
      'closingDate-month': '1',
      'closingDate-year': '0',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Year must be at least 1900')
  })

  it('On validation error - should disallow a closingDate month being more than 12', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '1',
      'closingDate-month': '1',
      'closingDate-year': '3000',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Year must be at most 2100')
  })

  it('On validation error - should disallow a closingDate month being a non numeric value', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '1',
      'closingDate-month': '1',
      'closingDate-year': 'a',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Year must be a number')
  })

  it('On validation error - should disallow a closingDate must be a valid date', () => {
    req.body.isRollingOpportunity = 'NO'
    req.body.closingDate = {
      'closingDate-day': '31',
      'closingDate-month': '2',
      'closingDate-year': '1971',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Closing date must be a real date')
  })
})
