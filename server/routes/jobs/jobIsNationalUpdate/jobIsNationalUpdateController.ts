import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'
import YesNoValue from '../../../enums/yesNoValue'

export default class JobIsNationalUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params

    try {
      const job = getSessionData(req, ['job', id])
      if (!job && mode === 'update') {
        logger.error('Error rendering page - Is this a national job - No record found in session')
        res.redirect(addressLookup.jobs.jobIsNationalUpdate('new'))
        return
      }

      // Render data
      const data = {
        id,
        mode,
        backLocation: mode === 'add' ? addressLookup.jobs.jobRoleUpdate(id) : addressLookup.jobs.jobReview(id),
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
      if (mode === 'update') {
        if (job.isNational === YesNoValue.YES && isNational === YesNoValue.NO) {
          // Changing job from national to regional - need to update postcode info on the contract page.
          nextPage = addressLookup.jobs.jobContractUpdate(id, mode)
        } else {
          nextPage = addressLookup.jobs.jobReview(id)
        }
      } else {
        nextPage = addressLookup.jobs.jobContractUpdate(id)
      }

      setSessionData(req, ['job', id], {
        ...job,
        isNational,
        isNationalChanged:
          mode === 'update' ? job.isNational === YesNoValue.YES && isNational === YesNoValue.NO : false,
      })

      // Redirect to next page in flow
      res.redirect(nextPage)
    } catch (err) {
      logger.error('Error posting form - Job is this a national job')
      next(err)
    }
  }
}
