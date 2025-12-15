import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema, modeValue } from '../../../utils'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'
import YesNoValue from '../../../enums/yesNoValue'

export default class JobIsNationalUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params

    try {
      const job = getSessionData(req, ['job', id])
      if (!job && mode !== modeValue.add) {
        logger.error('Error rendering page - Is this a national job - No record found in session')
        res.redirect(addressLookup.jobs.jobIsNationalUpdate('new'))
        return
      }

      let backLocation: string
      if (mode === modeValue.add) {
        backLocation = addressLookup.jobs.jobRoleUpdate(id)
      } else if (mode === modeValue.duplicate) {
        backLocation = addressLookup.jobs.jobDuplicate(id)
      } else {
        backLocation = addressLookup.jobs.jobReview(id)
      }
      // Render data
      const data = {
        id,
        mode,
        backLocation,
        ...(job || {}),
      }

      // Set page data in session
      setSessionData(req, ['jobIsNationalUpdate', id, 'data'], data)

      res.render('pages/jobs/jobIsNationalUpdate/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page = Is National Job')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { isNational } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobIsNationalUpdate', id, 'data'])
      const errors = validateFormSchema(req.body, validationSchema())
      if (errors) {
        res.render('pages/jobs/jobIsNationalUpdate/index', {
          ...data,
          ...req.body,
          errors,
        })
        return
      }

      // Update job in session
      const job = getSessionData(req, ['job', id], {})

      let nextPage: string
      if (mode === modeValue.add) {
        nextPage = addressLookup.jobs.jobContractUpdate(id)
      } else if (job.isNational === YesNoValue.YES && isNational === YesNoValue.NO) {
        // Changing job from national to regional - need to update postcode info on the contract page.
        nextPage = addressLookup.jobs.jobContractUpdate(id, mode)
      } else if (mode === modeValue.update) {
        nextPage = addressLookup.jobs.jobReview(id)
      } else {
        nextPage = addressLookup.jobs.jobDuplicate(id)
      }

      setSessionData(req, ['job', id], {
        ...job,
        isNational,
        isNationalChanged:
          mode === modeValue.add ? false : job.isNational === YesNoValue.YES && isNational === YesNoValue.NO,
      })

      // Redirect to next page in flow
      res.redirect(nextPage)
    } catch (err) {
      logger.error('Error posting form - Job is this a national job')
      next(err)
    }
  }
}
