import { Router } from 'express'

import type { Services } from '../../../services'
import EmployerReviewController from './employerReviewController'

export default (router: Router, services: Services) => {
  const controller = new EmployerReviewController(services.employerService)

  router.get('/employers/employer/:id', controller.get)

  router.post('/employers/employer/:id', controller.post)
}
