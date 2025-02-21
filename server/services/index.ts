import { dataAccess } from '../data'
import UserService from './userService'
import EmployerService from './employerService'
import JobService from './jobService'
import PaginationService from './paginationServices'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const employerService = new EmployerService(hmppsAuthClient)
  const jobService = new JobService(hmppsAuthClient)
  const paginationService = new PaginationService()

  return {
    userService,
    employerService,
    jobService,
    paginationService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
