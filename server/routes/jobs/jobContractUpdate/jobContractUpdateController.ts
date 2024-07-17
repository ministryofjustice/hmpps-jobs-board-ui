import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'

export default class jobContractUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      const job = getSessionData(req, ['job', id])
      if (!job) {
        res.redirect(addressLookup.jobs.jobRoleUpdate())
        return
      }

      // Render data
      const data = {
        id,
        backLocation: id === 'new' ? addressLookup.jobs.jobRoleUpdate(id) : addressLookup.jobs.jobReview(id),
        ...job,
      }

      // Set page data in session
      setSessionData(req, ['jobContractUpdate', id, 'data'], data)

      res.render('pages/jobs/jobContractUpdate/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const {
      postcode,
      salaryFrom,
      salaryTo,
      salaryPeriod,
      additionalSalaryInformation,
      nationalMinimumWage,
      workPattern,
      contractType,
      hours,
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
      setSessionData(req, ['job', id], {
        ...data,
        postcode,
        salaryFrom,
        salaryTo,
        salaryPeriod,
        additionalSalaryInformation,
        nationalMinimumWage,
        workPattern,
        contractType,
        hours,
        baseLocation,
      })

      // Redirect to next page in flow
      res.redirect(addressLookup.jobs.jobReview(id))
    } catch (err) {
      next(err)
    }
  }
}
