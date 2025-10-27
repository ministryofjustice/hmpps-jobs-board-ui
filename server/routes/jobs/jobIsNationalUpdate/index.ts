import { Router } from 'express'

import JobIsNationalUpdateController from './jobIsNationalUpdateController'
import { Services } from '../../../services'

export default (router: Router, _: Services) => {
  const controller = new JobIsNationalUpdateController()

  router.get('/jobs/job/:id/is-this-national-job/:mode', controller.get)

  router.post('/jobs/job/:id/is-this-national-job/:mode', controller.post)
}
