import { Router } from 'express'

import JobHowToApplyUpdateController from './jobHowToApplyUpdateController'
import { Services } from '../../../services'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import parseDateInputValue from '../../../middleware/parseDateInputValue'

export default (router: Router, _: Services) => {
  const controller = new JobHowToApplyUpdateController()

  router.get('/jobs/job/:id/how-to-apply/:mode', controller.get)

  router.post(
    '/jobs/job/:id/how-to-apply/:mode',
    [
      parseCheckBoxValue('supportingDocumentation'),
      parseDateInputValue('startDate'),
      parseDateInputValue('closingDate'),
    ],
    controller.post,
  )
}
