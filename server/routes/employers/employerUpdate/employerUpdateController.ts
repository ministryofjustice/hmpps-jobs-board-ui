import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema, modeValue } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'

export default class EmployerUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params

    try {
      const employer = getSessionData(req, ['employer', id], {})

      // Render data
      const data = {
        id,
        mode,
        backLocation:
          mode === modeValue.add
            ? `${addressLookup.employers.employerList()}?sort=name&order=ascending`
            : addressLookup.employers.employerReview(id),
        ...employer,
      }

      // Set page data in session
      setSessionData(req, ['employerUpdate', id, 'data'], data)

      res.render('pages/employers/employerUpdate/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Employer update')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { employerName, employerDescription, employerSector, employerStatus } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['employerUpdate', id, 'data'])
      const errors = validateFormSchema(req.body, validationSchema())
      if (errors) {
        res.render('pages/employers/employerUpdate/index', {
          ...data,
          ...req.body,
          errors,
        })
        return
      }

      // Update employer in session
      setSessionData(req, ['employer', id], {
        employerName,
        employerDescription,
        employerSector,
        employerStatus,
      })

      // Redirect to employers
      res.redirect(addressLookup.employers.employerReview(id))
    } catch (err) {
      logger.error('Error posting form - Employer update')
      next(err)
    }
  }
}
