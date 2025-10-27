import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import consolidateDateInputErrors from '../../../utils/consolidateDateInputErrors'
import getDateInputObject from '../../../utils/getDateInputObject'
import parseBodyDateInput from '../../../utils/parseBodyDateInput'
import YesNoValue from '../../../enums/yesNoValue'
import logger from '../../../../logger'

export default class jobHowToApplyUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params

    try {
      const job = getSessionData(req, ['job', id])

      // Redirect to first page if no job
      if (!job) {
        logger.error('Error rendering page - How to apply - No record found in session')
        res.redirect(addressLookup.jobs.jobRoleUpdate(id))
        return
      }

      const jobToRender = {
        ...job,
        supportingDocumentationRequired: job.supportingDocumentationRequired || [],
        startDate: getDateInputObject(job.startDate, 'startDate'),
        closingDate: getDateInputObject(job.closingDate, 'closingDate'),
      }
      const errors = mode === 'update' ? validateFormSchema(jobToRender, validationSchema()) : null

      // Render data
      const data = {
        id,
        mode,
        backLocation: mode === 'add' ? addressLookup.jobs.jobRequirementsUpdate(id) : addressLookup.jobs.jobReview(id),
        ...jobToRender,
        errors,
      }

      // Set page data in session
      setSessionData(req, ['jobHowToApplyUpdate', id, 'data'], data)

      res.render('pages/jobs/jobHowToApplyUpdate/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - How to apply')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const {
      howToApply,
      isRollingOpportunity,
      isOnlyForPrisonLeavers,
      supportingDocumentationRequired,
      supportingDocumentationDetails,
    } = req.body

    try {
      // Clear closing date if not required
      if (isRollingOpportunity === YesNoValue.YES) {
        req.body = {
          ...req.body,
          ...{
            'closingDate-day': '',
            'closingDate-month': '',
            'closingDate-year': '',
          },
        }
      }

      // If validation errors render errors
      const data = getSessionData(req, ['jobHowToApplyUpdate', id, 'data'])
      const errors = validateFormSchema(req.body, validationSchema())

      if (errors) {
        // Consolidate date input field errors
        consolidateDateInputErrors(req, errors, 'startDate')
        consolidateDateInputErrors(req, errors, 'closingDate')

        res.render('pages/jobs/jobHowToApplyUpdate/index', {
          ...data,
          ...req.body,
          supportingDocumentationRequired: supportingDocumentationRequired || [],
          errors,
        })
        return
      }

      // Update job in session
      const job = getSessionData(req, ['job', id])
      // Use actual ID
      setSessionData(req, ['job', id], {
        ...job,
        howToApply,
        isRollingOpportunity,
        isOnlyForPrisonLeavers,
        supportingDocumentationRequired,
        supportingDocumentationDetails,
        startDate: parseBodyDateInput(req, 'startDate'),
        closingDate: isRollingOpportunity === YesNoValue.NO ? parseBodyDateInput(req, 'closingDate') : undefined,
      })

      // Redirect to next page in flow
      res.redirect(addressLookup.jobs.jobReview(id))
    } catch (err) {
      logger.error('Error posting form - How to apply')
      next(err)
    }
  }
}
