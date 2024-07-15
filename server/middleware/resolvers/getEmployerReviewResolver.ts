import type { RequestHandler } from 'express'

import EmployerService from '../../services/employerService'
import { getSessionData, setSessionData } from '../../utils/index'

// Gets employers
const getEmployerReviewResolver =
  (employerService: EmployerService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // If session contains current employer
      if (getSessionData(req, ['employer', id])) {
        next()
        return
      }

      // Get employer from API
      const employer = await employerService.getEmployer(username, id)
      setSessionData(req, ['employer', id], {
        employerName: employer.name,
        employerSector: employer.sector,
        employerStatus: employer.status,
        employerDescription: employer.description,
      })

      next()
    } catch (err) {
      next(err)
    }
  }

export default getEmployerReviewResolver
