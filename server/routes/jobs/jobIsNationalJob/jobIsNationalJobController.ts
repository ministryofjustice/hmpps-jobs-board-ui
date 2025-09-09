import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'

export default class JobIsNationalJobController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params

    try {
      const job = getSessionData(req, ['job', id])
      if (!job && mode === 'update') {
        logger.error('Error rendering page - Job is this a national job - No record found in session')
        res.redirect(addressLookup.jobs.jobIsNationalJob('new'))
        return
      }

      // Render data
      const data = {
        id,
        mode,
        backLocation:
          mode === 'add'
            ? `${addressLookup.jobs.jobList()}?sort=jobTitle&order=ascending`
            : addressLookup.jobs.jobReview(id),
        ...(job || {}),
      }

      // Set page data in session
      setSessionData(req, ['jobIsNationalJob', id, 'data'], data)

      res.render('pages/jobs/jobIsNationalJob/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Job is this a national job')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { employerId } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobIsNationalJob', id, 'data'])
      const errors = validateFormSchema(req, validationSchema())
      if (errors) {
        res.render('pages/jobs/jobIsNationalJob/index', {
          ...data,
          ...req.body,
          errors,
        })
        return
      }

      // Update job in session
      const job = getSessionData(req, ['job', id], {})
      setSessionData(req, ['job', id], {
        ...job,
        employerId,
      })

      // Redirect to next page in flow
      res.redirect(mode === 'add' ? addressLookup.jobs.jobRoleUpdate(id) : addressLookup.jobs.jobReview(id))
    } catch (err) {
      logger.error('Error posting form - Job is this a national job')
      next(err)
    }
  }
}
