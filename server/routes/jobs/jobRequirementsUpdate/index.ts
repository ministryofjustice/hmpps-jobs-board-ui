import { Router } from 'express'

import JobRequirementsUpdateController from './jobRequirementsUpdateController'
import { Services } from '../../../services'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

export default (router: Router, _: Services) => {
  const controller = new JobRequirementsUpdateController()

  router.get('/jobs/job/:id/requirements', controller.get)

  router.post('/jobs/job/:id/requirements', [parseCheckBoxValue('offenceExclusions')], controller.post)
}
