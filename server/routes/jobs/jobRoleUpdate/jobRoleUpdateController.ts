import { RequestHandler } from 'express'

import { getSessionData, setSessionData, validateFormSchema } from '../../../utils/index'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'

export default class jobRoleUpdateController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { allEmployers = [] } = req.context

    try {
      const job = getSessionData(req, ['job', id], {})

      // Render data
      const data = {
        id,
        backLocation:
          id === 'new'
            ? `${addressLookup.jobs.jobList()}?sort=jobTitle&order=ascending`
            : addressLookup.jobs.jobReview(id),
        employers: allEmployers.map((e: { id: string; name: string }) => ({
          value: e.id,
          text: e.name,
        })),
        ...job,
      }

      // Set page data in session
      setSessionData(req, ['jobRoleUpdate', id, 'data'], data)

      res.render('pages/jobs/jobRoleUpdate/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { employerId, jobTitle, jobSector, industrySector, numberOfVacancies, jobSource, jobSource2, charity } =
      req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobRoleUpdate', id, 'data'])
      const errors = validateFormSchema(req, validationSchema())
      if (errors) {
        res.render('pages/jobs/jobRoleUpdate/index', {
          ...data,
          ...req.body,
          errors,
        })
        return
      }

      // Update job in session
      setSessionData(req, ['job', id], {
        ...data,
        employerId,
        jobTitle,
        jobSector,
        industrySector,
        numberOfVacancies,
        jobSource,
        jobSource2,
        charity,
      })

      // Redirect to jobs
      res.redirect(addressLookup.jobs.jobReview(id))
    } catch (err) {
      next(err)
    }
  }
}
