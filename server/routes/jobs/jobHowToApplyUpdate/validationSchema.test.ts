import OffenceExclusions from '../../../enums/offenceExclusions'
import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  beforeEach(() => {
    req.body.rollingOpportunity = 'NO'
    req.body.prisonLeaversJob = 'YES'
    req.body.howToApply = 'Some text'
  })

  it('On validation success - should allow all valid values', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow a supportingDocumentationDetails with 200 characters', () => {
    req.body.supportingDocumentation = ['OTHER']
    req.body.supportingDocumentationDetails = 'x'.repeat(200)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - should allow a supportingDocumentationDetails being blank', () => {
    req.body.supportingDocumentation = ['OTHER']
    req.body.supportingDocumentationDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a supportingDocumentationDetails longer than 200 characters', () => {
    req.body.supportingDocumentation = ['OTHER']
    req.body.supportingDocumentationDetails = 'x'.repeat(201)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Other supporting documentation must be 200 characters or less')
  })
})
