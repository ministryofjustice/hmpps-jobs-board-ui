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
      supportingDocumentationDetails: joi
        .string()
        .max(200)
        .when('supportingDocumentation', {
          is: joi.array().items(joi.string().valid('OTHER')).has('OTHER'),
          then: joi.string().allow('').optional().max(200).messages({
            'string.max': 'Other supporting documentation must be 200 characters or less',
          }),
          otherwise: joi.string().allow('').optional(),
        }),
      startDate: joi
        .object({
          'startDate-day': joi.number().empty('').integer().min(1).max(31).optional().messages({
            'number.base': 'Day must be a number',
            'number.min': 'Day must be at least 1',
            'number.max': 'Day must be at most 31',
          }),
          'startDate-month': joi.number().empty('').integer().min(1).max(12).optional().messages({
            'number.base': 'Month must be a number',
            'number.min': 'Month must be at least 1',
            'number.max': 'Month must be at most 12',
          }),
          'startDate-year': joi.number().empty('').integer().min(1900).max(2100).optional().messages({
            'number.base': 'Year must be a number',
            'number.min': 'Year must be at least 1900',
            'number.max': 'Year must be at most 2100',
          }),
        })
        .custom((value, helpers) => {
          const day = value['startDate-day']
          const month = value['startDate-month']
          const year = value['startDate-year']

          // Check if any of the date parts are provided
          const isDayProvided = day !== undefined
          const isMonthProvided = month !== undefined
          const isYearProvided = year !== undefined

          // Ensure all parts are either provided or not
          if (
            (isDayProvided || isMonthProvided || isYearProvided) &&
            !(isDayProvided && isMonthProvided && isYearProvided)
          ) {
            return helpers.error('any.required', { message: 'All parts of the date must be provided if any are set' })
          }

          // If all parts are provided, check if they form a valid date
          if (isDayProvided && isMonthProvided && isYearProvided) {
            const date = new Date(year, month - 1, day)
            if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
              return helpers.error('any.invalid', { message: 'The provided date is invalid' })
            }
          }

          return value
        })
        .messages({
          'any.required': 'All parts of the date must be provided if any are set',
          'any.invalid': 'The provided date is invalid',
        }),
      closingDate: joi
        .object({
          'closingDate-day': joi.number().empty('').integer().min(1).max(31).optional().messages({
            'number.base': 'Day must be a number',
            'number.min': 'Day must be at least 1',
            'number.max': 'Day must be at most 31',
          }),
          'closingDate-month': joi.number().empty('').integer().min(1).max(12).optional().messages({
            'number.base': 'Month must be a number',
            'number.min': 'Month must be at least 1',
            'number.max': 'Month must be at most 12',
          }),
          'closingDate-year': joi.number().empty('').integer().min(1900).max(2100).optional().messages({
            'number.base': 'Year must be a number',
            'number.min': 'Year must be at least 1900',
            'number.max': 'Year must be at most 2100',
          }),
        })
        .custom((value, helpers) => {
          const day = value['closingDate-day']
          const month = value['closingDate-month']
          const year = value['closingDate-year']

          // Check if any of the date parts are provided
          const isDayProvided = day !== undefined
          const isMonthProvided = month !== undefined
          const isYearProvided = year !== undefined

          // Ensure all parts are either provided or not
          if (
            (isDayProvided || isMonthProvided || isYearProvided) &&
            !(isDayProvided && isMonthProvided && isYearProvided)
          ) {
            return helpers.error('any.required', { message: 'All parts of the date must be provided if any are set' })
          }

          // If all parts are provided, check if they form a valid date
          if (isDayProvided && isMonthProvided && isYearProvided) {
            const date = new Date(year, month - 1, day)
            if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
              return helpers.error('any.invalid', { message: 'The provided date is invalid' })
            }
          }

          return value
        })
        .messages({
          'any.required': 'All parts of the date must be provided if any are set',
          'any.invalid': 'The provided date is invalid',
        }),
    })
    .when(joi.object({ rollingOpportunity: 'NO' }).unknown(), {
      then: joi.object({
        closingDate: joi.object({
          'closingDate-day': joi.number().integer().min(1).max(31).required().messages({
            'number.base': 'Day must be a number',
            'number.min': 'Day must be at least 1',
            'number.max': 'Day must be at most 31',
            'any.required': 'Day is required if rollingOpportunity is NO',
          }),
          'closingDate-month': joi.number().integer().min(1).max(12).required().messages({
            'number.base': 'Month must be a number',
            'number.min': 'Month must be at least 1',
            'number.max': 'Month must be at most 12',
            'any.required': 'Month is required if rollingOpportunity is NO',
          }),
          'closingDate-year': joi.number().integer().min(1900).max(2100).required().messages({
            'number.base': 'Year must be a number',
            'number.min': 'Year must be at least 1900',
            'number.max': 'Year must be at most 2100',
            'any.required': 'Year is required if rollingOpportunity is NO',
          }),
        }),
      }),
    })
}
