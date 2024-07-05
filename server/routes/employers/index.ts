import { Router } from 'express'
import type { Services } from '../../services'
import employerUpdateRoutes from './employerUpdate'
import employerReviewRoutes from './employerReview'

export default function attachRoutes(router: Router, services: Services): void {
  employerUpdateRoutes(router)
  employerReviewRoutes(router, services)
}
