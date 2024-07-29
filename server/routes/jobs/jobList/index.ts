import { Router } from 'express'
import JobListController from './jobListController'
import type { Services } from '../../../services'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getJobListResolver from '../../../middleware/resolvers/getJobListResolver'

export default (router: Router, services: Services) => {
  const controller = new JobListController(services.paginationService)
  router.get('/jobs', [getJobListResolver(services.jobService)], controller.get)

  router.post(
    '/jobs',
    [handleSortMiddleware('sortAction', 'jobTitle'), handleSortMiddleware('sortAction', 'createdAt')],
    controller.post,
  )
}
