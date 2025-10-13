import { Router } from 'express'
import type { Services } from '../../services'
import jobAddEmployerRoutes from './jobAddEmployer'
import jobRoleUpdateRoutes from './jobRoleUpdate'
import jobIsNationalRoutes from './jobIsNational'

export default function attachRoutes(router: Router, services: Services): void {
  jobAddEmployerRoutes(router, services)

  jobRoleUpdateRoutes(router, services)

  jobIsNationalRoutes(router)
}
