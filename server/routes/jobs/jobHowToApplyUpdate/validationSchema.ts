/* eslint-disable consistent-return */
import joi from 'joi'
import type { ObjectSchema } from 'joi'
import YesNoValue from '../../../enums/yesNoValue'

export default function validationSchema(): ObjectSchema {
  return joi
    .object({
      rollingOpportunity: joi.string().empty('').valid(YesNoValue.YES, YesNoValue.NO).required().messages({
        'any.only': 'Select whether the job is a rolling opportunity or not',
        'any.required': 'Select whether the job is a rolling opportunity or not',
        'any.empty': 'Select whether the job is a rolling opportunity or not',
      }),
      prisonLeaversJob: joi.string().empty('').valid(YesNoValue.YES, YesNoValue.NO).required().messages({
        'any.only': 'Select an answer to whether this job is only for prison leavers. ',
        'any.required': 'Select an answer to whether this job is only for prison leavers. ',
        'any.empty': 'Select an answer to whether this job is only for prison leavers. ',
      }),
      howToApply: joi.string().empty('').required().max(1000).messages({
        'any.required': 'Enter how to apply details',
        'any.empty': 'Enter how to apply details',
        'string.max': 'How to apply must be 1000 characters or less',
      }),
      supportingDocumentationDetails: joi.string().allow(''),
    })
    .custom((obj, helper) => {
      const { supportingDocumentationDetails, supportingDocumentation } = obj

      if (!supportingDocumentation || !supportingDocumentation.includes('OTHER')) {
        return true
      }

      if (supportingDocumentationDetails.length > 200) {
        return helper.error('any.length', {
          key: 'supportingDocumentationDetails',
          label: 'supportingDocumentationDetails',
        })
      }

      return true
    })
    .messages({
      'any.length': 'Other supporting documentation must be 200 characters or less',
    })
}
