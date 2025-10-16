import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import logger from '../../../logger'

// Gets employers
const getJobListResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const {
      page = '1',
      sort = '',
      order = '',
      jobSectorFilter = '',
      jobTitleOrEmployerNameFilter = '',
      myOwnJobsFilter = false,
    } = req.query

    try {
      const jobs = await jobService.getJobs(username, {
        username,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
        jobSectorFilter: jobSectorFilter.toString(),
        jobTitleOrEmployerNameFilter: jobTitleOrEmployerNameFilter.toString(),
        myOwnJobsFilter: myOwnJobsFilter === 'true',
      })

      req.context.jobs = jobs

      next()
    } catch (err) {
      logger.error('Error getting data - Job list')
      next(err)
    }
  }

export default getJobListResolver
