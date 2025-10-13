import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'
import YesNoValue from '../../../enums/yesNoValue'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  beforeEach(() => {
    req.body.isNationalJob = YesNoValue.YES
  })

  it('On validation success - should allow all valid values', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a isNationalJob being blank', () => {
    req.body.isNationalJob = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select if this is a national job')
  })

  it('On validation error - should disallow a isNationalJob being an invalid value', () => {
    req.body.isNationalJob = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Select if this is a national job')
  })
})
