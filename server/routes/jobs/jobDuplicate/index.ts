import { Router } from 'express'

import type { Services } from '../../../services'
import JobDuplicateController from './jobDuplicateController'
import getJobDuplicateResolver from '../../../middleware/resolvers/getJobDuplicateResolver'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'

export default (router: Router, services: Services) => {
  const controller = new JobDuplicateController()

  router.get(
    '/jobs/job/:id/duplicate',
    [getJobDuplicateResolver(services.jobService), getAllEmployersResolver(services.employerService)],
    controller.get,
  )

  router.post('/jobs/job/:id/duplicate', controller.post)
}
