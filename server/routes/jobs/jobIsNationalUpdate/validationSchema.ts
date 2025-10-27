import joi from 'joi'
import type { ObjectSchema } from 'joi'
import YesNoValue from '../../../enums/yesNoValue'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    isNational: joi.string().empty('').valid(YesNoValue.YES, YesNoValue.NO).required().messages({
      'any.only': 'Select if this is a national job',
      'any.required': 'Select if this is a national job',
      'any.empty': 'Select if this is a national job',
    }),
  })
}
