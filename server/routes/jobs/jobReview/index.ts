import { Router } from 'express'

import type { Services } from '../../../services'
import JobReviewController from './jobReviewController'
import getjobReviewResolver from '../../../middleware/resolvers/getJobReviewResolver'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'

export default (router: Router, services: Services) => {
  const controller = new JobReviewController(services.jobService)

  router.get(
    '/jobs/job/:id',
    [getjobReviewResolver(services.jobService), getAllEmployersResolver(services.employerService)],
    controller.get,
  )

  router.post('/jobs/job/:id', controller.post)
}
