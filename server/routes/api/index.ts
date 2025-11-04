import type { Router } from 'express'

import type { Services } from '../../services'
import featuresEnabledRoutes from './featuresEnabled'

export default (router: Router, services: Services) => {
  featuresEnabledRoutes(router)
}
