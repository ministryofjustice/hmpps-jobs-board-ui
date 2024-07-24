import { Router } from 'express'

import type { Services } from '../../../services'
import JobReviewController from './jobReviewController'
import getJobReviewResolver from '../../../middleware/resolvers/getJobReviewResolver'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'

export default (router: Router, services: Services) => {
  const controller = new JobReviewController(services.jobService)

  router.get(
    '/jobs/job/:id',
    [getJobReviewResolver(services.jobService), getAllEmployersResolver(services.employerService)],
    controller.get,
  )

  router.post('/jobs/job/:id', controller.post)
}
