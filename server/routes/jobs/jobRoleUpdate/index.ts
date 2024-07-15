import { Router } from 'express'

import JobRoleUpdateController from './jobRoleUpdateController'

export default (router: Router) => {
  const controller = new JobRoleUpdateController()

  router.get('/jobs/job/:id/role', controller.get)

  router.post('/jobs/job/:id/role', controller.post)
}
