import jwtDecode from 'jwt-decode'
import type { RequestHandler } from 'express'

import logger from '../../logger'
import asyncMiddleware from './asyncMiddleware'

export enum AuthRole {
  ROLE_JOBS_BOARD_VIEWER = 'ROLE_JOBS_BOARD_VIEWER',
  ROLE_JOBS_BOARD_EDITOR = 'ROLE_JOBS_BOARD_EDITOR',
  ROLE_JOBS_BOARD_EDITOR_NFN = 'ROLE_JOBS_BOARD_EDITOR_NFN',
}
export const isAuthorisedRole = (role: string): boolean =>
  Object.keys(AuthRole)
    .map(key => AuthRole[key as keyof typeof AuthRole])
    .includes(role as AuthRole)

export const getAuthorisedRoles = (): string[] =>
  Object.keys(AuthRole).map(key => AuthRole[key as keyof typeof AuthRole])

export default function authorisationMiddleware(authorisedRoles: string[] = []): RequestHandler {
  return asyncMiddleware((req, res, next) => {
    if (res.locals.user?.token) {
      const { authorities: roles = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }

      if (authorisedRoles.length && !roles.some(role => authorisedRoles.includes(role))) {
        logger.error(`User is not authorised to access this - ${res.locals.user.username}`)
        return res.redirect('/authError')
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  })
}
