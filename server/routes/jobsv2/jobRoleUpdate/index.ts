import { Router } from 'express'

import JobRoleUpdateController from './jobRoleUpdateController'
import { Services } from '../../../services'
import getAllEmployersResolver from '../../../middleware/resolvers/getAllEmployersResolver'

export default (router: Router, services: Services) => {
  const controller = new JobRoleUpdateController()

  router.get('/jobsv2/job/:id/role/:mode', [getAllEmployersResolver(services.employerService)], controller.get)

  router.post('/jobsv2/job/:id/role/:mode', controller.post)
}
