import { Router } from 'express'
import EmployerListController from './employerListController'
import type { Services } from '../../../services'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getEmployerListResolver from '../../../middleware/resolvers/getEmployerListResolver'

export default (router: Router, services: Services) => {
  const controller = new EmployerListController(services.paginationService)
  router.get('/', [getEmployerListResolver(services.employerService)], controller.get)

  router.post(
    '/',
    [handleSortMiddleware('sortAction', 'name'), handleSortMiddleware('sortAction', 'createdAt')],
    controller.post,
  )
}
