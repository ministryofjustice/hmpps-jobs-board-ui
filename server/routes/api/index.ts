import type { Router } from 'express'

import featuresEnabledRoutes from './featuresEnabled'

export default (router: Router) => {
  featuresEnabledRoutes(router)
}
