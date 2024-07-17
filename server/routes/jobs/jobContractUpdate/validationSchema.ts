/* eslint-disable consistent-return */
import joi from 'joi'
import type { ObjectSchema } from 'joi'
import SalaryPeriod from '../../../enums/salaryPeriod'
import WorkPattern from '../../../enums/workPattern'
import ContractType from '../../../enums/contractType'
import Hours from '../../../enums/hours'
import BaseLocation from '../../../enums/baseLocation'
import YesNoValue from '../../../enums/yesNoValue'

export default function validationSchema(): ObjectSchema {
  const postcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i

  return joi.object({
    postcode: joi.string().empty('').regex(postcodeRegex).required().messages({
      'any.required': 'Enter a job location',
      'any.empty': 'Enter a job location',
      'string.pattern.base': 'Job location must be a valid postcode',
    }),
    salaryFrom: joi
      .number()
      .empty('')
      .required()
      .min(1)
      .max(10000000)
      .custom((obj, helper) => {
        const val = obj.toString()

        if (val.split('.').length > 1) {
          if (val.split('.')[1].length > 2) {
            return helper.error('number.precision', {
              key: 'salaryFrom',
              label: 'salaryFrom',
            })
          }
        }
      })
      .messages({
        'any.required': 'Enter minimum salary amount',
        'any.empty': 'Enter minimum salary amount',
        'number.base': 'Salary from must be a number',
        'number.max': 'Salary from must be 7 characters or less',
        'number.min': 'Salary from must be a positive number',
        'number.precision': 'Number can only include a maximum of 2 characters after the decimal point',
      }),
    salaryTo: joi
      .number()
      .empty('')
      .min(1)
      .max(10000000)
      .custom((obj, helper) => {
        const val = obj.toString()

        if (val.split('.').length > 1) {
          if (val.split('.')[1].length > 2) {
            return helper.error('number.precision', {
              key: 'salaryTo',
              label: 'salaryTo',
            })
          }
        }
      })
      .messages({
        'number.base': 'Salary to must be a number',
        'number.max': 'Salary to must be 7 characters or less',
        'number.min': 'Salary to must be a positive number',
        'number.precision': 'Number can only include a maximum of 2 characters after the decimal point',
      }),
    salaryPeriod: joi
      .string()
      .empty('')
      .valid(
        SalaryPeriod.PER_DAY,
        SalaryPeriod.PER_FORTNIGHT,
        SalaryPeriod.PER_HOUR,
        SalaryPeriod.PER_MONTH,
        SalaryPeriod.PER_WEEK,
        SalaryPeriod.PER_YEAR,
        SalaryPeriod.PER_YEAR_PRO_RATA,
      )
      .required()
      .messages({
        'any.only': 'Select a salary period',
        'any.required': 'Select a salary period',
        'any.empty': 'Select a salary period',
      }),
    additionalSalaryInformation: joi.string().empty('').max(100).messages({
      'string.max': 'Additional salary information must be 100 characters or less',
    }),
    nationalMinimumWage: joi.string().empty('').valid(YesNoValue.YES, YesNoValue.NO).required().messages({
      'any.only': 'Select whether the job pays minimum wage or not',
      'any.required': 'Select whether the job pays minimum wage or not',
      'any.empty': 'Select whether the job pays minimum wage or not',
    }),
    workPattern: joi
      .string()
      .empty('')
      .valid(
        WorkPattern.ANNUALISED_HOURS,
        WorkPattern.COMPRESSED_HOURS,
        WorkPattern.FLEXI_TIME,
        WorkPattern.FLEXIBLE_SHIFTS,
        WorkPattern.JOB_SHARE,
        WorkPattern.STAGGERED_HOURS,
        WorkPattern.TERM_TIME_HOURS,
        WorkPattern.UNSOCIABLE_HOURS,
      )
      .required()
      .messages({
        'any.only': 'Select a work pattern',
        'any.required': 'Select a work pattern',
        'any.empty': 'Select a work pattern',
      }),
    contractType: joi
      .string()
      .empty('')
      .valid(
        ContractType.FIXED_TERM_CONTRACT,
        ContractType.PERMANENT,
        ContractType.SELF_EMPLOYMENT,
        ContractType.TEMPORARY,
      )
      .required()
      .messages({
        'any.only': 'Select a contract type',
        'any.required': 'Select a contract type',
        'any.empty': 'Select a contract type',
      }),
    hours: joi
      .string()
      .empty('')
      .valid(Hours.FULL_TIME, Hours.FULL_TIME_40_PLUS, Hours.PART_TIME, Hours.ZERO_HOURS)
      .required()
      .messages({
        'any.only': 'Select the hours for this job',
        'any.required': 'Select the hours for this job',
        'any.empty': 'Select the hours for this job',
      }),
    baseLocation: joi
      .string()
      .empty('')
      .valid(BaseLocation.REMOTE, BaseLocation.HYBRID, BaseLocation.WORKPLACE)
      .messages({
        'any.only': 'Select the base location for this job',
      }),
  })
}
