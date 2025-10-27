import type { ObjectSchema } from 'joi'

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
export default function validateFormSchema(
  form: any,
  schema: ObjectSchema,
  context: any = {},
): FormValidationErrors | undefined {
  const { error } = schema.validate(form, { abortEarly: false, allowUnknown: true, context })

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
