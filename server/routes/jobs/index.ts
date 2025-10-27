import { Router } from 'express'
import type { Services } from '../../services'
import jobListRoutes from './jobList'
import jobRoleUpdateRoutes from './jobRoleUpdate'
import jobIsNationalUpdateRoutes from './jobIsNationalUpdate'
import jobContractUpdateRoutes from './jobContractUpdate'
import jobRequirementsUpdateRoutes from './jobRequirementsUpdate'
import jobHowToApplyUpdateRoutes from './jobHowToApplyUpdate'
import jobReviewUpdateRoutes from './jobReview'

export default function attachRoutes(router: Router, services: Services): void {
  jobListRoutes(router, services)
  jobRoleUpdateRoutes(router, services)
  jobIsNationalUpdateRoutes(router, services)
  jobContractUpdateRoutes(router, services)
  jobRequirementsUpdateRoutes(router, services)
  jobHowToApplyUpdateRoutes(router, services)
  jobReviewUpdateRoutes(router, services)
}
