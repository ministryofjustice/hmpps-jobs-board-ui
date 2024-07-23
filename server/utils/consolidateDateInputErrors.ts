/* eslint-disable no-param-reassign */
import { FormValidationErrors } from './validateFormSchema'

// Updates body and errors by reference
export default function consolidateDateInputErrors(
  req: { body: { [x: string]: unknown } },
  errors: FormValidationErrors,
  fieldName: string,
): void {
  // Consolidate errors for the given fieldName
  errors[fieldName] =
    errors[fieldName] || errors[`${fieldName}-day`] || errors[`${fieldName}-month`] || errors[`${fieldName}-year`]

  // Update req.body with consolidated date input
  req.body[fieldName] = {
    [`${fieldName}-day`]: req.body[`${fieldName}-day`],
    [`${fieldName}-day-error`]: errors[`${fieldName}-day`],
    [`${fieldName}-month`]: req.body[`${fieldName}-month`],
    [`${fieldName}-month-error`]: errors[`${fieldName}-month`],
    [`${fieldName}-year`]: req.body[`${fieldName}-year`],
    [`${fieldName}-year-error`]: errors[`${fieldName}-year`],
  }

  // Clear individual date part errors
  errors[`${fieldName}-day`] = undefined
  errors[`${fieldName}-month`] = undefined
  errors[`${fieldName}-year`] = undefined
}
