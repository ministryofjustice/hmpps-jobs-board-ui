import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'
import YesNoValue from '../../../enums/yesNoValue'

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

      const jobToRender = {
        ...job,
        postCode: job.postCode || '',
      }

      const errors = mode === 'update' ? validateFormSchema(jobToRender, validationSchema()) : null
      // Calculate the back location.
      // When updating a job, if changing a job from national -> non-national, the national job page routes to this page to allow the
      // user to enter a postcode for the job. In this scenario, the back link should go to the national job page, not the review page.
      let backLocation: string
      if (mode === 'add') {
        backLocation =
          res.locals.useNationalJobs === true
            ? addressLookup.jobs.jobIsNationalUpdate(id)
            : addressLookup.jobs.jobRoleUpdate(id)
      } else {
        backLocation =
          res.locals.useNationalJobs === true && job.isNationalChanged
            ? addressLookup.jobs.jobIsNationalUpdate(id, mode)
            : addressLookup.jobs.jobReview(id)
      }

      // Render data
      const data = {
        id,
        mode,
        backLocation,
        ...jobToRender,
        errors,
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
      postCode = null,
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

    const job = getSessionData(req, ['job', id])

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobContractUpdate', id, 'data'])
      const errors = validateFormSchema(req.body, validationSchema(), {
        isNational: res.locals.useNationalJobs && job.isNational === YesNoValue.YES,
      })
      if (errors) {
        res.render('pages/jobs/jobContractUpdate/index', {
          ...data,
          ...req.body,
          errors,
        })
        return
      }

      // Update job in session
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
