import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'

// Gets employers
const getJobListResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { page = '1', sort = '', order = '', sectorFilter = '', jobSearchFilter = '' } = req.query

    try {
      const jobs = await jobService.getJobs(username, {
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
        sectorFilter: sectorFilter.toString(),
        jobSearchFilter: jobSearchFilter.toString(),
      })

      req.context.jobs = jobs

      next()
    } catch (err) {
      next(err)
    }
  }

export default getJobListResolver
