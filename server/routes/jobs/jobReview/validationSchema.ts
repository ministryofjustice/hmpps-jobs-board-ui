/* eslint-disable consistent-return */
import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  const exclusionsCodeRegex = /^[A-Za-z0-9 ]+$/i

  return joi
    .object({
      offenceExclusionsDetails: joi.string().when('offenceExclusions', {
        is: joi.array().has('OTHER'),
        then: joi.string().empty('').regex(exclusionsCodeRegex).required().min(3).max(100).messages({
          'string.min': "'Other offence exclusions' must be 3 characters or more",
          'string.max': "'Other offence exclusions' must be 100 characters or less",
          'any.min': "'Other offence exclusions' must be 3 characters or more",
          'any.max': "'Other offence exclusions' must be 100 characters or less",
          'any.empty': 'Enter details of the other offence exclusions',
          'any.required': 'Enter details of the other offence exclusions',
          'string.pattern.base': "'Other offence exclusions' can only include letters, numbers and spaces",
        }),
        otherwise: joi.string().allow('').optional(),
      }),
    })
    .custom((values, helpers) => {
      if (values.sourcePrimary && values.sourceSecondary && values.sourcePrimary === values.sourceSecondary) {
        return helpers.error('any.invalid', { key: 'sourceSecondary' })
      }
      return values
    })
    .messages({
      'any.invalid': 'First and second job sources must be different',
    })
}
