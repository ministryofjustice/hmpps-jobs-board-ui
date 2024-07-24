import { Router } from 'express'
import JobListController from './jobListController'
import type { Services } from '../../../services'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'

export default (router: Router, service: Services) => {
  const controller = new JobListController(service.paginationService)
  router.get('/jobs', controller.get)

  router.post(
    '/jobs',
    [
      handleSortMiddleware('sortAction', 'jobTitle'),
      handleSortMiddleware('sortAction', 'jobSectorDisplay'),
      handleSortMiddleware('sortAction', 'createdAt'),
    ],
    controller.post,
  )
}
