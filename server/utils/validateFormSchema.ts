import type { ObjectSchema } from 'joi'
import type { Request } from 'express'

export interface FormValidationErrors {
  [key: string]: { text: string; href: string }
}

export interface ErrorDetails {
  [key: string]: {
    text: string
    href: string
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function validateReviewSchema(
  reviewForm: { [key: string]: any },
  schemas: ObjectSchema[],
): FormValidationErrors | undefined {
  const errors: ErrorDetails = {}
  schemas.forEach((schema: ObjectSchema) => {
    const { error } = schema.validate(reviewForm, { abortEarly: false, allowUnknown: true })
    if (error?.details) {
      error.details.forEach(detail => {
        const { key } = detail.context
        errors[key] = {
          text: detail.message,
          href: `#${key}`,
        }
      })
    }
  })
  return Object.keys(errors).length > 0 ? errors : undefined
}

export default function validateFormSchema(req: Request, schema: ObjectSchema): FormValidationErrors | undefined {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

  if (!error?.details) {
    return undefined
  }

  /* eslint-disable no-param-reassign */
  return error.details.reduce((previous, current) => {
    const { key } = current.context
    previous[key] = {
      text: current.message,
      href: `#${key}`,
    }
    return previous
  }, {} as ErrorDetails)
}
