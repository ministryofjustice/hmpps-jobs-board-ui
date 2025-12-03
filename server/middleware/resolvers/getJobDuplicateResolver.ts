import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import { getSessionData, setSessionData } from '../../utils/index'
import YesNoValue from '../../enums/yesNoValue'
import logger from '../../../logger'

// Gets job that's being duplicated, and the new job that's being created
const getJobDuplicateResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check if session contains the new job being created.
      if (getSessionData(req, ['job', 'new'])) {
        next()
        return
      }

      // Get job to be duplicated from API
      const job = await jobService.getJob(username, id)

      // Set it in session as a new job
      setSessionData(req, ['job', 'new'], {
        ...job,
        isPayingAtLeastNationalMinimumWage: job.isPayingAtLeastNationalMinimumWage ? YesNoValue.YES : YesNoValue.NO,
        isRollingOpportunity: job.isRollingOpportunity ? YesNoValue.YES : YesNoValue.NO,
        isOnlyForPrisonLeavers: job.isOnlyForPrisonLeavers ? YesNoValue.YES : YesNoValue.NO,
        isNational: job.isNational ? YesNoValue.YES : YesNoValue.NO,
        sourceJobId: id,
        id: 'new',
      })

      next()
    } catch (err) {
      logger.error('Error getting data - Job')
      next(err)
    }
  }

export default getJobDuplicateResolver
