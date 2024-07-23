import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import { getSessionData, setSessionData } from '../../utils/index'
import YesNoValue from '../../enums/yesNoValue'

// Gets jobs
const getjobReviewResolver =
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
        nationalMinimumWage: job.nationalMinimumWage ? YesNoValue.YES : YesNoValue.NO,
        rollingOpportunity: job.rollingOpportunity ? YesNoValue.YES : YesNoValue.NO,
        prisonLeaversJob: job.prisonLeaversJob ? YesNoValue.YES : YesNoValue.NO,
      })

      next()
    } catch (err) {
      next(err)
    }
  }

export default getjobReviewResolver
