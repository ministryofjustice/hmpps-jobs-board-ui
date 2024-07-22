import { Router } from 'express'

import type { Services } from '../../../services'
import JobReviewController from './jobReviewController'

export default (router: Router, services: Services) => {
  const controller = new JobReviewController(services.jobService)

  router.get('/jobs/job/:id', controller.get)

  router.post('/jobs/job/:id', controller.post)
}
