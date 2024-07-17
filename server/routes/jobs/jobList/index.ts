import { Router } from 'express'
import JobListController from './jobListController'
import type { Services } from '../../../services'

export default (router: Router, _: Services) => {
  const controller = new JobListController()
  router.get('/jobs', controller.get)

  router.post('/jobs', controller.post)
}
