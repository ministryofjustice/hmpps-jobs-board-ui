import { dataAccess } from '../data'
import UserService from './userService'
import ComponentService from './componentService'
import EmployerService from './employerService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const employerService = new EmployerService(hmppsAuthClient)
  const componentService = new ComponentService()

  return {
    userService,
    employerService,
    componentService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
