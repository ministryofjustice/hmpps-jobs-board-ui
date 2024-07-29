import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    jobTitleOrEmployerNameFilter: joi.string().allow('').min(3).max(50).messages({
      'string.min': 'Job title or employer name must be 3 characters or more',
      'string.max': 'Job title or employer name must be 50 characters or less',
    }),
  })
}
