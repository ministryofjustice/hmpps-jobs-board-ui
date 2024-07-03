import { dataAccess } from '../data'
import UserService from './userService'
import ComponentService from './componentService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const componentService = new ComponentService()

  return {
    userService,
    componentService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
