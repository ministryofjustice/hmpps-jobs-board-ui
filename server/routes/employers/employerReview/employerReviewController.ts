import { RequestHandler } from 'express'
import { v7 as uuidv7 } from 'uuid'
import _ from 'lodash'

import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/index'
import addressLookup from '../../addressLookup'
import EmployerService from '../../../services/employerService'
import logger from '../../../../logger'

export default class EmployerReviewController {
  constructor(private readonly employerService: EmployerService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      const employer = getSessionData(req, ['employer', id])
      if (!employer) {
        logger.error('Error rendering page - Employer review - No record found in session')
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
      logger.error('Error rendering page - Employer review')
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

      const identifier = _.trim(id.toString()) === 'new' ? uuidv7() : id

      await this.employerService.createUpdateEmployer(res.locals.user.username, identifier, employerUpdate)

      // Delete current record
      deleteSessionData(req, ['employer', id])

      // Redirect to employers
      res.redirect(`${addressLookup.employers.employerList()}?sort=name&order=ascending`)
    } catch (err) {
      if (err.status === 400) {
        const data = getSessionData(req, ['employerReview', id, 'data'])
        // TODO: Add function to looup error message and UI fieldname
        const errors = {
          employerName: {
            text: 'The name provided already exists. Please choose a different name.',
            href: `${addressLookup.employers.employerUpdate(id, 'update')}#employerName`,
          },
        }
        res.render('pages/employers/employerReview/index', {
          ...data,
          ...req.body,
          errors,
        })
        return
      }

      logger.error('Error posting form - Employer review')
      next(err)
    }
  }
}
