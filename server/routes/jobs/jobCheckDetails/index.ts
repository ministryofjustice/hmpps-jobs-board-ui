import { Router } from 'express'

import JobCheckDetailsController from './jobCheckDetailsController'
import { Services } from '../../../services'

export default (router: Router, services: Services) => {
  const controller = new JobCheckDetailsController(services.jobService)

  router.get('/jobs/job/:id/check-details', controller.get)

  router.post('/jobs/job/:id/check-details', controller.post)
}
