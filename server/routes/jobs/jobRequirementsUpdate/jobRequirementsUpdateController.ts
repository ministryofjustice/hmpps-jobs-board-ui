import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'

export default class JobRequirementsUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params

    try {
      const job = getSessionData(req, ['job', id])

      // Redirect to first page if no job
      if (!job) {
        res.redirect(addressLookup.jobs.jobRoleUpdate(id))
        return
      }

      // Render data
      const data = {
        id,
        mode,
        backLocation: mode === 'add' ? addressLookup.jobs.jobContractUpdate(id) : addressLookup.jobs.jobReview(id),
        ...job,
        offenceExclusions: job.offenceExclusions || [],
      }

      // Set page data in session
      setSessionData(req, ['jobRequirementsUpdate', id, 'data'], data)

      res.render('pages/jobs/jobRequirementsUpdate/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { essentialCriteria, desirableCriteria, description, offenceExclusions } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobRequirementsUpdate', id, 'data'])
      const errors = validateFormSchema(req, validationSchema())
      if (errors) {
        res.render('pages/jobs/jobRequirementsUpdate/index', {
          ...data,
          ...req.body,
          offenceExclusions: offenceExclusions || [],
          errors,
        })
        return
      }

      // Update job in session
      const job = getSessionData(req, ['job', id])
      setSessionData(req, ['job', id], {
        ...job,
        essentialCriteria,
        desirableCriteria,
        description,
        offenceExclusions,
      })

      // Redirect to next page in flow
      res.redirect(mode === 'add' ? addressLookup.jobs.jobHowToApplysUpdate(id) : addressLookup.jobs.jobReview(id))
    } catch (err) {
      next(err)
    }
  }
}
