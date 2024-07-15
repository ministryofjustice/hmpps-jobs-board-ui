import { Router } from 'express'

import type { Services } from '../services'
import employersRoutes from './employers'

export default function routes(services: Services): Router {
  const router = Router()

  // Employer routes, includes index
  employersRoutes(router, services)

  return router
}
