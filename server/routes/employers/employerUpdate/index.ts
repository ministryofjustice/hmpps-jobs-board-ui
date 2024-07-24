import { Router } from 'express'

import EmployerUpdateController from './employerUpdateController'

export default (router: Router) => {
  const controller = new EmployerUpdateController()

  router.get('/employers/employer/:id/form/:mode', controller.get)

  router.post('/employers/employer/:id/form/:mode', controller.post)
}
