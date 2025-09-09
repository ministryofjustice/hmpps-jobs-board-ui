import { Router } from 'express'

import JobIsNationalJobController from './jobIsNationalJobController'

export default (router: Router) => {
  const controller = new JobIsNationalJobController()

  router.get('/jobs/job/:id/is-this-national-job/:mode', controller.get)

  router.post('/jobs/job/:id/is-this-national-job/:mode', controller.post)
}
