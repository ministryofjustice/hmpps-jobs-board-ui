import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    employerId: joi.string().empty('').required().messages({
      'any.required': 'Enter the employer name',
      'any.empty': 'Enter the employer name',
    }),
  })
}
