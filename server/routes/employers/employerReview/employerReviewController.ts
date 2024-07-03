import { RequestHandler } from 'express'

import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/index'
import addressLookup from '../../addressLookup'
import EmployerService from '../../../services/employerService'

export default class EmployerReviewController {
  constructor(private readonly employerService: EmployerService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      let employer
      if (id === 'new') {
        employer = getSessionData(req, ['employer', id])
        if (!employer) {
          res.redirect(addressLookup.employers.employerUpdate())
          return
        }
      } else {
        employer = req.context.employer
      }

      // Render data
      const data = {
        backLocation: id === 'new' ? addressLookup.employers.employerUpdate(id) : addressLookup.homePage(),
        ...employer,
      }

      // Set page data in session
      setSessionData(req, ['employerReview', id, 'data'], data)

      res.render('pages/employers/employerReview/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      const employer = getSessionData(req, ['employer', id])
      const { employerName, employerSector, employerStatus, employerDescription } = employer

      // Update application progress API
      if (id === 'new') {
        await this.employerService.createEmployer(res.locals.user.username, {
          employerName,
          employerSector,
          employerStatus,
          employerDescription,
        })
      } else {
        await this.employerService.updateEmployer(res.locals.user.username, {
          employerId: id,
          employerName,
          employerSector,
          employerStatus,
          employerDescription,
        })
      }

      // Delete current record
      deleteSessionData(req, ['employer', id])

      // Redirect to employers
      res.redirect(addressLookup.homePage())
    } catch (err) {
      next(err)
    }
  }
}
