import { Router } from 'express'

import JobAddEmployerController from './jobAddEmployerController'
import { Services } from '../../../services'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'

export default (router: Router, services: Services) => {
  const controller = new JobAddEmployerController()

  router.get('/jobs/job/:id/add-employer/:mode', [getAllEmployersResolver(services.employerService)], controller.get)

  router.post('/jobs/job/:id/add-employer/:mode', controller.post)
}
