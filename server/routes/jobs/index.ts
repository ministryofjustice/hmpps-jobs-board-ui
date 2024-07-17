import { Router } from 'express'
import type { Services } from '../../services'
import jobListRoutes from './jobList'
import jobRoleUpdateRoutes from './jobRoleUpdate'
import jobContractUpdateRoutes from './jobContractUpdate'

export default function attachRoutes(router: Router, services: Services): void {
  jobListRoutes(router, services)
  jobRoleUpdateRoutes(router, services)
  jobContractUpdateRoutes(router, services)
}
