import joi from 'joi'
import type { ObjectSchema } from 'joi'
import EmployerSector from '../../../enums/employerSector'
import EmployerStatus from '../../../enums/employerStatus'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    employerName: joi.string().empty('').required().min(3).max(100).messages({
      'any.required': 'Employer name must be 3 characters or more',
      'any.empty': 'Employer name must be 3 characters or more',
      'any.max': 'Employer name must be 100 characters or less',
      'any.min': 'Employer name must be 3 characters or more',
    }),
    employerSector: joi
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
        'any.only': 'Select an employer sector',
        'any.required': 'Select an employer sector',
        'any.empty': 'Select an employer sector',
      }),
    employerStatus: joi
      .string()
      .empty('')
      .valid(EmployerStatus.GOLD, EmployerStatus.KEY_PARTNER, EmployerStatus.SILVER)
      .required()
      .messages({
        'any.only': 'Select an employer status',
        'any.required': 'Select an employer status',
        'any.empty': 'Select an employer status',
      }),
    employerDescription: joi.string().empty('').required().max(500).messages({
      'any.required': 'Enter employer description details',
      'any.empty': 'Enter employer description details',
      'any.max': 'Employer Description must be 500 characters or less',
    }),
  })
}
