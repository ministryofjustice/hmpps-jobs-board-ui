/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { setSessionData } from '../../../utils/session'
import addressLookup from '../../addressLookup'

export default class JobListController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      // Render data
      const data = {}

      setSessionData(req, ['jobList', 'data'], data)

      res.render('pages/jobs/jobList/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      if (Object.prototype.hasOwnProperty.call(req.body, 'addJobButton')) {
        res.redirect(addressLookup.jobs.jobRoleUpdate('new'))
        return
      }

      res.redirect(addressLookup.jobs.jobList())
    } catch (err) {
      next(err)
    }
  }
}
