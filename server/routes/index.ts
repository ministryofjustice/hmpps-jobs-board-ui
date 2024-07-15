import { Router } from 'express'

import type { Services } from '../services'
import employersRoutes from './employers'
import jobsRoutes from './jobs'

export default function routes(services: Services): Router {
  const router = Router()

  // Employer routes, includes index
  employersRoutes(router, services)

  // Jobs routes, includes index
  jobsRoutes(router, services)

  return router
}
