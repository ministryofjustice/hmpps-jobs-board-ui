import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    jobSearchFilter: joi.string().allow('').min(3).max(50).messages({
      'string.min': 'Job title must be 3 characters or more',
      'string.max': 'Job title must be 50 characters or less',
    }),
  })
}
