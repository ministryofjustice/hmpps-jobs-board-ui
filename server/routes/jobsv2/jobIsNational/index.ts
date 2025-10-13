import { Router } from 'express'

import JobIsNationalController from './jobIsNationalController'

export default (router: Router) => {
  const controller = new JobIsNationalController()

  router.get('/jobsv2/job/:id/is-this-national-job/:mode', controller.get)

  router.post('/jobsv2/job/:id/is-this-national-job/:mode', controller.post)
}
