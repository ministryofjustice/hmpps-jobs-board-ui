import { v7 as uuidv7 } from 'uuid'
import EmployerApiClient from '../data/employerApi/employerApiClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import EmployerSector from '../enums/employerSector'
import EmployerStatus from '../enums/employerStatus'

export default class EmployerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async createEmployer(
    username: string,
    params: {
      employerName: string
      employerSector: string
      employerStatus: string
      employerDescription: string
    },
  ) {
    const { employerName, employerSector, employerStatus, employerDescription } = params

    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    // Generate new id and put
    const result = new EmployerApiClient(systemToken).putEmployer(uuidv7(), {
      name: employerName,
      sector: employerSector as EmployerSector,
      status: employerStatus as EmployerStatus,
      description: employerDescription,
    })

    return result
  }

  async updateEmployer(
    username: string,
    params: {
      employerId: string
      employerName: string
      employerSector: string
      employerStatus: string
      employerDescription: string
    },
  ) {
    const { employerId, employerName, employerSector, employerStatus, employerDescription } = params

    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    // Use existing id and put
    return new EmployerApiClient(systemToken).putEmployer(employerId, {
      name: employerName,
      sector: employerSector as EmployerSector,
      status: employerStatus as EmployerStatus,
      description: employerDescription,
    })
  }

  async getEmployer(username: string, id: string) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new EmployerApiClient(systemToken).getEmployer(id)
  }
}
