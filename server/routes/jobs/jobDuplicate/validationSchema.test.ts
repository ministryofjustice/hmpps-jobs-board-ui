import OffenceExclusions from '../../../enums/offenceExclusions'
import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  beforeEach(() => {
    req.body.sourcePrimary = 'DWP'
    req.body.sourceSecondary = 'EAB'
    req.body.offenceExclusions = [OffenceExclusions.CASE_BY_CASE]
  })

  it('On validation success - should allow all valid values', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow offenceExclusionsDetails if offenceExclusions includes OTHER', () => {
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

  it('On validation success - should allow offenceExclusionsDetails being null if offenceExclusions does not include OTHER', () => {
    req.body.offenceExclusions = ['NONE']
    req.body.offenceExclusionsDetails = null

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a offenceExclusionsDetails longer than 100 characters', () => {
    req.body.offenceExclusions = ['NONE', 'OTHER']
    req.body.offenceExclusionsDetails = 'x'.repeat(501)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe("'Other offence exclusions' must be 100 characters or less")
  })

  it('On validation error - should disallow a offenceExclusionsDetails shorter than 3 characters', () => {
    req.body.offenceExclusions = ['NONE', 'OTHER']
    req.body.offenceExclusionsDetails = 'xx'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe("'Other offence exclusions' must be 3 characters or more")
  })

  it('On validation error - should disallow a offenceExclusionsDetails containing punctuation', () => {
    req.body.offenceExclusions = ['NONE', 'OTHER']
    req.body.offenceExclusionsDetails = 'Some text, Some text'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe("'Other offence exclusions' can only include letters, numbers and spaces")
  })

  it('On validation error - should disallow duplicate values with sourcePrimary and sourceSecondary', () => {
    req.body.sourcePrimary = 'DWP'
    req.body.sourceSecondary = 'DWP'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('First and second job sources must be different')
  })

  it('On validation error - should still disallow duplicate sources when other fields have errors', () => {
    req.body.offenceExclusions = ['NONE', 'OTHER']
    req.body.offenceExclusionsDetails = 'xx'
    req.body.sourcePrimary = 'DWP'
    req.body.sourceSecondary = 'DWP'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details.length).toBe(2)
    expect(error.details[0].message).toBe("'Other offence exclusions' must be 3 characters or more")
    expect(error.details[1].message).toBe('First and second job sources must be different')
  })
})
