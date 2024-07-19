/* eslint-disable no-param-reassign */
import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { FormValidationErrors } from '../../../utils/validateFormSchema'

export default class jobHowToApplyUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      const job = getSessionData(req, ['job', id])

      // Redirect to first page if no job
      if (!job) {
        res.redirect(addressLookup.jobs.jobRoleUpdate())
        return
      }

      // Render data
      const data = {
        id,
        backLocation: id === 'new' ? addressLookup.jobs.jobRequirementsUpdate(id) : addressLookup.jobs.jobReview(id),
        ...job,
        supportingDocumentation: job.supportingDocumentation || [],
        startDate: getDateInputObject(job.startDate, 'startDate'),
        closingDate: getDateInputObject(job.closingDate, 'closingDate'),
      }

      // Set page data in session
      setSessionData(req, ['jobHowToApplyUpdate', id, 'data'], data)

      res.render('pages/jobs/jobHowToApplyUpdate/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const {
      howToApply,
      rollingOpportunity,
      prisonLeaversJob,
      supportingDocumentation,
      supportingDocumentationDetails,
    } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobHowToApplyUpdate', id, 'data'])
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        // Consolidate date input field errors
        consolidateDateInputErrors(req, errors, 'startDate')
        consolidateDateInputErrors(req, errors, 'closingDate')

        res.render('pages/jobs/jobHowToApplyUpdate/index', {
          ...data,
          ...req.body,
          supportingDocumentation: supportingDocumentation || [],
          errors,
        })
        return
      }

      // Update job in session
      setSessionData(req, ['job', id], {
        ...data,
        howToApply,
        rollingOpportunity,
        prisonLeaversJob,
        supportingDocumentation,
        supportingDocumentationDetails,
        startDate: parseBodyDateInput(req, 'startDate'),
        closingDate: parseBodyDateInput(req, 'closingDate'),
      })

      // Redirect to next page in flow
      res.redirect(addressLookup.jobs.jobReview(id))
    } catch (err) {
      next(err)
    }
  }
}

function parseBodyDateInput(req: { body: { [x: string]: number } }, fieldname: string) {
  return (
    req.body[`${fieldname}-day`] &&
    req.body[`${fieldname}-month`] &&
    req.body[`${fieldname}-year`] &&
    new Date(
      req.body[`${fieldname}-day`],
      req.body[`${fieldname}-month`] - 1,
      req.body[`${fieldname}-year`],
    ).toISOString()
  )
}

function getDateInputObject(dateString: string, fieldName: string) {
  if (!dateString) {
    // If the date is falsy, return an object with empty strings
    return {
      [`${fieldName}-day`]: '',
      [`${fieldName}-month`]: '',
      [`${fieldName}-year`]: '',
    }
  }

  // Create date object
  const date = new Date(dateString)

  // Extract day, month (1-based), and year from the Date object
  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString() // Months are 0-based, so add 1
  const year = date.getFullYear().toString()

  return {
    [`${fieldName}-day`]: day,
    [`${fieldName}-month`]: month,
    [`${fieldName}-year`]: year,
  }
}

function consolidateDateInputErrors(
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
