import { RequestHandler } from 'express'

import { deleteSessionData, formatShortDate, getSessionData, setSessionData } from '../../../utils/index'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'

export default class JobDuplicateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { allEmployers = [] } = req.context

    try {
      const id = 'new'
      const job = getSessionData(req, ['job', id])
      if (!job) {
        logger.error('Error rendering page - Job duplicate - No record found in session')
        res.redirect(addressLookup.jobs.jobList())
        return
      }

      const errors = validateFormSchema(job, validationSchema())

      // Render data
      const data = {
        id,
        ...job,
        startDate: job.startDate && formatShortDate(new Date(job.startDate)),
        closingDate: job.closingDate && formatShortDate(new Date(job.closingDate)),
        employerName: (allEmployers.find((p: { id: string }) => p.id === job.employerId) || {}).name,
        errors,
      }

      // Set page data in session
      setSessionData(req, ['jobDuplicate', id, 'data'], data)

      res.render('pages/jobs/jobDuplicate/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Job duplicate')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const id = 'new'

    try {
      if (Object.prototype.hasOwnProperty.call(req.body, 'cancel-duplicate-button')) {
        // Clear session data for duplicate job
        deleteSessionData(req, ['job', id])
        deleteSessionData(req, ['jobDuplicate', id, 'data'])
        res.redirect(addressLookup.jobs.jobList())
        return
      }

      const job = getSessionData(req, ['job', id])
      const errors = validateFormSchema(job, validationSchema())
      if (errors) {
        res.render('pages/jobs/jobDuplicate/index', {
          id,
          ...job,
          employerName: (req.context.allEmployers || []).find((p: { id: string }) => p.id === job.employerId)?.name,
          startDate: job.startDate && formatShortDate(new Date(job.startDate)),
          closingDate: job.closingDate && formatShortDate(new Date(job.closingDate)),
          errors,
        })
        return
      }

      // Redirect to next page in flow
      res.redirect(addressLookup.jobs.jobCheckDetails(id))
    } catch (err) {
      logger.error('Error posting form - Job duplicate')
      next(err)
    }
  }
}
