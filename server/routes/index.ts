import { Router } from 'express'

import type { Services } from '../services'
import employersRoutes from './employers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()

  router.get('/', (req, res, next) => {
    res.render('pages/index')
  })

  // Work readiness routes
  employersRoutes(router, services)

  return router
}
