import type { RequestHandler } from 'express'

import EmployerService from '../../services/employerService'
import logger from '../../../logger'

// Gets employers
const getEmployerListResolver =
  (employerService: EmployerService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { page = '1', sort = '', order = '', employerSectorFilter = '', employerNameFilter = '' } = req.query

    try {
      const employers = await employerService.getEmployers(username, {
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
        employerSectorFilter: employerSectorFilter.toString(),
        employerNameFilter: employerNameFilter.toString(),
      })

      req.context.employers = employers

      next()
    } catch (err) {
      logger.error('Error getting data - Employer list')
      next(err)
    }
  }

export default getEmployerListResolver
