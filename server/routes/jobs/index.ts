import { Router } from 'express'
import type { Services } from '../../services'
import jobListRoutes from './jobList'
import jobRoleUpdateRoutes from './jobRoleUpdate'

export default function attachRoutes(router: Router, services: Services): void {
  jobListRoutes(router, services)
  jobRoleUpdateRoutes(router)
}
