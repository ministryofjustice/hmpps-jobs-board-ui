import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'

export default class JobContractUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params

    try {
      const job = getSessionData(req, ['job', id])

      // Redirect to first page if no job
      if (!job) {
        logger.error('Error rendering page - Job contract - No record found in session')
        res.redirect(addressLookup.jobs.jobRoleUpdate(id))
        return
      }

      // Render data
      const data = {
        id,
        mode,
        backLocation: mode === 'add' ? addressLookup.jobs.jobRoleUpdate(id) : addressLookup.jobs.jobReview(id),
        ...job,
      }

      // Set page data in session
      setSessionData(req, ['jobContractUpdate', id, 'data'], data)

      res.render('pages/jobs/jobContractUpdate/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Job contract')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const {
      postCode,
      salaryFrom,
      salaryTo,
      salaryPeriod,
      additionalSalaryInformation,
      isPayingAtLeastNationalMinimumWage,
      workPattern,
      contractType,
      hoursPerWeek,
      baseLocation,
    } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobContractUpdate', id, 'data'])
      const errors = validateFormSchema(req, validationSchema())
      if (errors) {
        res.render('pages/jobs/jobContractUpdate/index', {
          ...data,
          ...req.body,
          errors,
        })
        return
      }

      // Update job in session
      const job = getSessionData(req, ['job', id])
      setSessionData(req, ['job', id], {
        ...job,
        postCode,
        salaryFrom: Number(salaryFrom),
        salaryTo: salaryTo ? Number(salaryTo) : undefined,
        salaryPeriod,
        additionalSalaryInformation,
        isPayingAtLeastNationalMinimumWage,
        workPattern,
        contractType,
        hoursPerWeek,
        baseLocation,
      })

      // Redirect to next page in flow
      res.redirect(mode === 'add' ? addressLookup.jobs.jobRequirementsUpdate(id) : addressLookup.jobs.jobReview(id))
    } catch (err) {
      logger.error('Error posting form - Job contract')
      next(err)
    }
  }
}
