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
      if (id !== 'new') {
        // We have the id of the source job, so load the source job data from the API
        const job = await jobService.getJob(username, id)

        // Set it in session as a new job
        setSessionData(req, ['job', 'new'], {
          ...job,
          isPayingAtLeastNationalMinimumWage: job.isPayingAtLeastNationalMinimumWage ? YesNoValue.YES : YesNoValue.NO,
          isRollingOpportunity: job.isRollingOpportunity ? YesNoValue.YES : YesNoValue.NO,
          isOnlyForPrisonLeavers: job.isOnlyForPrisonLeavers ? YesNoValue.YES : YesNoValue.NO,
          isNational: job.isNational ? YesNoValue.YES : YesNoValue.NO,
          id: 'new',
        })
      } else {
        // Otherwise, we expect the new job to already exist in the session.
        getSessionData(req, ['job', 'new'])
      }
      next()
    } catch (err) {
      logger.error('Error getting data - Job')
      next(err)
    }
  }

export default getJobDuplicateResolver
