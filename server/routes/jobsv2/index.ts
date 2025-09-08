import { Router } from 'express'
import type { Services } from '../../services'
import jobAddEmployerRoutes from './jobAddEmployer'

export default function attachRoutes(router: Router, services: Services): void {
  jobAddEmployerRoutes(router, services)
}
