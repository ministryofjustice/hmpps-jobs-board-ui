import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'

export default class JobRoleUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { allEmployers = [] } = req.context

    try {
      const job = getSessionData(req, ['job', id])
      if (!job && mode === 'update') {
        logger.error('Error rendering page - Job role - No record found in session')
        res.redirect(addressLookup.jobs.jobRoleUpdate('new'))
        return
      }

      let backLocation
      if (mode === 'add') {
        backLocation =
          res.locals.useNationalJobs === 'true'
            ? addressLookup.jobs.jobIsNationalJob(id)
            : `${addressLookup.jobs.jobList()}?sort=jobTitle&order=ascending`
      } else {
        backLocation = addressLookup.jobs.jobReview(id)
      }

      // Render data
      const data = {
        id,
        mode,
        backLocation,
        employers: allEmployers.map((e: { id: string; name: string }) => ({
          value: e.id,
          text: e.name,
        })),
        ...(job || {}),
      }

      // Set page data in session
      setSessionData(req, ['jobRoleUpdate', id, 'data'], data)

      res.render('pages/jobs/jobRoleUpdate/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Job role')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const {
      employerId,
      jobTitle,
      sector,
      industrySector,
      numberOfVacancies,
      sourcePrimary,
      sourceSecondary,
      charityName,
    } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobRoleUpdate', id, 'data'])
      const errors = validateFormSchema(req, validationSchema())
      if (errors) {
        res.render('pages/jobs/jobRoleUpdate/index', {
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
        jobTitle,
        sector,
        industrySector,
        numberOfVacancies: Number(numberOfVacancies),
        sourcePrimary,
        sourceSecondary,
        charityName,
      })

      // Redirect to next page in flow
      res.redirect(mode === 'add' ? addressLookup.jobs.jobContractUpdate(id) : addressLookup.jobs.jobReview(id))
    } catch (err) {
      logger.error('Error posting form - Job role')
      next(err)
    }
  }
}
