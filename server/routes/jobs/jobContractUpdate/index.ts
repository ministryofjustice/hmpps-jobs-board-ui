import { Router } from 'express'

import JobContractUpdateController from './jobContractUpdateController'
import { Services } from '../../../services'

export default (router: Router, _: Services) => {
  const controller = new JobContractUpdateController()

  router.get('/jobs/job/:id/contract/:mode', controller.get)

  router.post('/jobs/job/:id/contract/:mode', controller.post)
}
