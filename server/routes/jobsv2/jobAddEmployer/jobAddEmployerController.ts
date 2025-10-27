import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'

export default class JobAddEmployerController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { allEmployers = [] } = req.context

    try {
      const job = getSessionData(req, ['job', id])
      if (!job && mode === 'update') {
        logger.error('Error rendering page - Job add employer - No record found in session')
        res.redirect(addressLookup.jobsv2.jobAddEmployer('new'))
        return
      }

      // Render data
      const data = {
        id,
        mode,
        backLocation:
          mode === 'add'
            ? `${addressLookup.jobs.jobList()}?sort=jobTitle&order=ascending`
            : addressLookup.jobsv2.jobReview(id),
        employers: allEmployers.map((e: { id: string; name: string }) => ({
          value: e.id,
          text: e.name,
        })),
        ...(job || {}),
      }

      // Set page data in session
      setSessionData(req, ['jobAddEmployer', id, 'data'], data)

      res.render('pages/jobsv2/jobAddEmployer/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Job add employer')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { employerId } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobAddEmployer', id, 'data'])
      const errors = validateFormSchema(req, validationSchema())
      if (errors) {
        res.render('pages/jobsv2/jobAddEmployer/index', {
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
      res.redirect(mode === 'add' ? addressLookup.jobsv2.jobIsThisNational(id) : addressLookup.jobsv2.jobReview(id))
    } catch (err) {
      logger.error('Error posting form - Job add employer')
      next(err)
    }
  }
}
