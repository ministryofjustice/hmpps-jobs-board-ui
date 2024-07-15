import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    jobTitle: joi.string().empty('').required().min(3).max(100).messages({
      'any.required': 'Job title must be 3 characters or more',
      'any.empty': 'Job title must be 3 characters or more',
      'string.max': 'Job title must be 100 characters or less',
      'string.min': 'Job title must be 3 characters or more',
    }),
  })
}
