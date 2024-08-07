import { RequestHandler } from 'express'
import { v7 as uuidv7 } from 'uuid'

import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/index'
import addressLookup from '../../addressLookup'
import EmployerService from '../../../services/employerService'

export default class EmployerReviewController {
  constructor(private readonly employerService: EmployerService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      const employer = getSessionData(req, ['employer', id])
      if (!employer) {
        res.redirect(addressLookup.employers.employerUpdate(id))
        return
      }

      // Render data
      const data = {
        id,
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
      const employerUpdate = {
        employerName,
        employerSector,
        employerStatus,
        employerDescription,
      }
      await this.employerService.createUpdateEmployer(
        res.locals.user.username,
        id === 'new' ? uuidv7() : id,
        employerUpdate,
      )

      // Delete current record
      deleteSessionData(req, ['employer', id])

      // Redirect to employers
      res.redirect(`${addressLookup.employers.employerList()}?sort=name&order=ascending`)
    } catch (err) {
      next(err)
    }
  }
}
