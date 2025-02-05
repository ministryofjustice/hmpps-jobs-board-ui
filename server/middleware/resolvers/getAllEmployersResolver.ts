import type { RequestHandler } from 'express'

import EmployerService from '../../services/employerService'
import logger from '../../../logger'

// Gets all employers in a single collection
const getAllEmployersResolver =
  (employerService: EmployerService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user

    try {
      const employers = await employerService.getAllEmployers(username)

      req.context.allEmployers = employers.content

      next()
    } catch (err) {
      logger.error('Error getting data - All employers')
      next(err)
    }
  }

export default getAllEmployersResolver
