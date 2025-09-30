import { Router } from 'express'

import JobRoleUpdateController from './jobRoleUpdateController'
import { Services } from '../../../services'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'

export default (router: Router, services: Services) => {
  const controller = new JobRoleUpdateController()

  router.get('/jobs/job/:id/role/:mode', [getAllEmployersResolver(services.employerService)], controller.get)

  router.post('/jobs/job/:id/role/:mode', controller.post)
}
