import { Router } from 'express'

import type { Services } from '../../../services'
import EmployerReviewController from './employerReviewController'
import getEmployerReviewResolver from '../../../middleware/resolvers/getEmployerReviewResolver'

export default (router: Router, services: Services) => {
  const controller = new EmployerReviewController(services.employerService)

  router.get('/employers/employer/:id', [getEmployerReviewResolver(services.employerService)], controller.get)

  router.post('/employers/employer/:id', controller.post)
}
