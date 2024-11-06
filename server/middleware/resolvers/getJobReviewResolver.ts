import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import { getSessionData, setSessionData } from '../../utils/index'
import YesNoValue from '../../enums/yesNoValue'
import logger from '../../../logger'

// Gets jobs
const getJobReviewResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // If session contains current employer
      if (getSessionData(req, ['job', id])) {
        next()
        return
      }

      // Get job from API
      const job = await jobService.getJob(username, id)

      // Set it in session
      setSessionData(req, ['job', id], {
        ...job,
        isPayingAtLeastNationalMinimumWage: job.isPayingAtLeastNationalMinimumWage ? YesNoValue.YES : YesNoValue.NO,
        isRollingOpportunity: job.isRollingOpportunity ? YesNoValue.YES : YesNoValue.NO,
        isOnlyForPrisonLeavers: job.isOnlyForPrisonLeavers ? YesNoValue.YES : YesNoValue.NO,
      })

      next()
    } catch (err) {
      logger.error('Error getting data - Job')
      next(err)
    }
  }

export default getJobReviewResolver
