import { Router } from 'express'

import JobHowToApplyUpdateController from './jobHowToApplyUpdateController'
import { Services } from '../../../services'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

export default (router: Router, _: Services) => {
  const controller = new JobHowToApplyUpdateController()

  router.get('/jobs/job/:id/how-to-apply', controller.get)

  router.post('/jobs/job/:id/how-to-apply', [parseCheckBoxValue('supportingDocumentation')], controller.post)
}
