/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserDetails } from '../../services/userService'
import 'express-session'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    data: {
      [key: string]: any
    }
  }
}

export declare global {
  namespace Express {
    interface User extends Partial<UserDetails> {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }
  }
}
