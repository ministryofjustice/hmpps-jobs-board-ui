import { Router } from 'express'
import type { Services } from '../../services'
import employerListRoutes from './employerList'
import employerUpdateRoutes from './employerUpdate'
import employerReviewRoutes from './employerReview'

export default function attachRoutes(router: Router, services: Services): void {
  employerListRoutes(router, services)
  employerUpdateRoutes(router)
  employerReviewRoutes(router, services)
}
