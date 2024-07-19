import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'

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
    const { howToApply, supportingDocumentation } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobHowToApplyUpdate', id, 'data'])
      const errors = validateFormSchema(req, validationSchema())
      if (errors) {
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
        supportingDocumentation,
      })

      // Redirect to next page in flow
      res.redirect(addressLookup.jobs.jobReview(id))
    } catch (err) {
      next(err)
    }
  }
}
