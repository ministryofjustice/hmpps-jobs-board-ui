/* eslint-disable consistent-return */
import joi from 'joi'
import type { ObjectSchema } from 'joi'
import OffenceExclusions from '../../../enums/offenceExclusions'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    essentialCriteria: joi.string().empty('').required().max(1000).messages({
      'any.required': 'Enter essential job requirements',
      'any.empty': 'Enter essential job requirements',
      'string.max': 'Essential requirements must be 1000 characters or less',
    }),
    desirableCriteria: joi.string().empty('').max(1000).messages({
      'string.max': 'Desirable requirements must be 1000 characters or less',
    }),
    jobDescription: joi.string().empty('').required().max(3000).messages({
      'any.required': 'Enter job description',
      'any.empty': 'Enter job description',
      'string.max': 'Job description must be 3000 characters or less',
    }),
    offenceExclusions: joi
      .array()
      .required()
      .items(
        joi
          .any()
          .valid(
            OffenceExclusions.NONE,
            OffenceExclusions.CASE_BY_CASE,
            OffenceExclusions.ARSON,
            OffenceExclusions.DRIVING,
            OffenceExclusions.MURDER,
            OffenceExclusions.SEXUAL,
            OffenceExclusions.TERRORISM,
            OffenceExclusions.OTHER,
          ),
      )
      .messages({
        'any.only': 'Select one or more options in offence exclusions',
        'any.required': 'Select one or more options in offence exclusions',
      }),
  })
}
