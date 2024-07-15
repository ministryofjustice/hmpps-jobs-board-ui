import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    employerNameFilter: joi.string().allow('').min(2).max(200).messages({
      'string.min': 'Employer name must be 2 characters or more',
      'string.max': 'Employer name must be 200 characters or less',
    }),
  })
}
