import joi from 'joi'
import type { ObjectSchema } from 'joi'
import JobSector from '../../../enums/jobSector'
import EmployerSector from '../../../enums/employerSector'
import JobSource from '../../../enums/jobSource'

export default function validationSchema(): ObjectSchema {
  return joi
    .object({
      employerId: joi.string().empty('').required().messages({
        'any.required': "Select employer or select 'Add an employer'",
        'any.empty': "Select employer or select 'Add an employer'",
      }),
      jobTitle: joi.string().empty('').required().min(3).max(50).messages({
        'any.required': 'Job title must be 3 characters or more',
        'any.empty': 'Job title must be 3 characters or more',
        'string.max': 'Job title must be 50 characters or less',
        'string.min': 'Job title must be 3 characters or more',
      }),
      sector: joi
        .string()
        .empty('')
        .valid(
          JobSector.OUTDOOR,
          JobSector.CONSTRUCTION,
          JobSector.DRIVING,
          JobSector.BEAUTY,
          JobSector.HOSPITALITY,
          JobSector.TECHNICAL,
          JobSector.MANUFACTURING,
          JobSector.OFFICE,
          JobSector.RETAIL,
          JobSector.SPORTS,
          JobSector.WAREHOUSING,
          JobSector.EDUCATION_TRAINING,
          JobSector.WASTE_MANAGEMENT,
          JobSector.CLEANING_AND_MAINTENANCE,
          JobSector.OTHER,
        )
        .required()
        .messages({
          'any.only': 'Select a job sector',
          'any.required': 'Select a job sector',
          'any.empty': 'Select a job sector',
        }),
      industrySector: joi
        .string()
        .empty('')
        .valid(
          EmployerSector.ADMIN_SUPPORT,
          EmployerSector.AGRICULTURE,
          EmployerSector.ARTS_ENTERTAINMENT,
          EmployerSector.CONSTRUCTION,
          EmployerSector.EDUCATION,
          EmployerSector.ENERGY,
          EmployerSector.FINANCE,
          EmployerSector.HEALTH_SOCIAL,
          EmployerSector.HOSPITALITY_CATERING,
          EmployerSector.LOGISTICS,
          EmployerSector.MANUFACTURING,
          EmployerSector.MINING,
          EmployerSector.OTHER,
          EmployerSector.PROFESSIONALS_SCIENTISTS_TECHNICIANS,
          EmployerSector.PROPERTY,
          EmployerSector.PUBLIC_ADMIN_DEFENCE,
          EmployerSector.WASTE_MANAGEMENT,
          EmployerSector.RETAIL,
          EmployerSector.TECHNOLOGY,
        )
        .required()
        .messages({
          'any.only': 'Select an HMPPS reporting industry sector',
          'any.required': 'Select an HMPPS reporting industry sector',
          'any.empty': 'Select an HMPPS reporting industry sector',
        }),
      numberOfVacancies: joi.number().empty('').required().min(1).messages({
        'any.required': 'Enter number of vacancies',
        'any.empty': 'Enter number of vacancies',
        'number.base': 'Number of vacancies must be a number',
        'number.min': 'Number of vacancies must be a positive number',
      }),
      sourcePrimary: joi
        .string()
        .empty('')
        .valid(
          JobSource.DWP,
          JobSource.EAB,
          JobSource.EDUCATION,
          JobSource.IAG,
          JobSource.NFN,
          JobSource.PRISON,
          JobSource.THIRD_SECTOR,
          JobSource.PEL,
          JobSource.OTHER,
        )
        .required()
        .messages({
          'any.only': 'Select a job source',
          'any.required': 'Select a job source',
          'any.empty': 'Select a job source',
        }),
      sourceSecondary: joi
        .string()
        .empty('')
        .valid(
          JobSource.DWP,
          JobSource.EAB,
          JobSource.EDUCATION,
          JobSource.IAG,
          JobSource.NFN,
          JobSource.PRISON,
          JobSource.THIRD_SECTOR,
          JobSource.PEL,
          JobSource.OTHER,
        )
        .messages({
          'any.only': 'Select a job source',
        }),
      charityName: joi.string().empty('').max(100).messages({
        'string.max': 'Charity must be 100 characters or less',
      }),
    })
    .custom((values, helpers) => {
      if (values.sourcePrimary && values.sourceSecondary && values.sourcePrimary === values.sourceSecondary) {
        return helpers.error('any.invalid', { key: 'sourceSecondary' })
      }
      return values
    })
    .messages({
      'any.invalid': 'Secondary job source must be different from primary job source',
    })
}
