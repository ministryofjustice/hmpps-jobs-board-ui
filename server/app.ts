import 'reflect-metadata'
import express from 'express'
import dpsComponents from '@ministryofjustice/hmpps-connect-dps-components'

import path from 'path'
import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import authorisationMiddleware, { getAuthorisedRoles } from './middleware/authorisationMiddleware'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import expressContext from './middleware/expressContext'
import routes from './routes'
import type { Services } from './services'
import setUpLocals from './middleware/setUpLocals'
import setUpEnvironmentName from './middleware/setUpEnvironmentName'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import { ApplicationInfo } from './applicationInfo'
import sanitizeBody from './middleware/sanitizeBody'
import sanitizeQuery from './middleware/sanitizeQuery'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import config from './config'
import logger from '../logger'

export default function createApp(services: Services, applicationInfo: ApplicationInfo): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  setUpEnvironmentName(app)
  nunjucksSetup(app, path, applicationInfo)
  app.use(setUpAuthentication())
  app.use(setUpLocals())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(expressContext())

  // Sanitize user input
  app.use(sanitizeBody)
  app.use(sanitizeQuery)

  // App insight event emitter
  app.use(appInsightsMiddleware())

  // Get front end components for DPS header
  app.use(
    dpsComponents.getPageComponents({
      dpsUrl: config.dpsHomeUrl,
      logger,
    }),
  )

  // Check for authorised roles
  app.use(authorisationMiddleware(getAuthorisedRoles()))

  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
