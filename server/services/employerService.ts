import EmployerApiClient from '../data/employerApi/employerApiClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import EmployerSector from '../enums/employerSector'
import EmployerStatus from '../enums/employerStatus'

export default class EmployerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async createUpdateEmployer(
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

  async getEmployers(
    username: string,
    params: {
      page?: number
      sort?: string
      order?: string
      employerNameFilter?: string
      employerSectorFilter?: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new EmployerApiClient(systemToken).getEmployers(params)
  }

  async getAllEmployers(username: string) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new EmployerApiClient(systemToken).getAllEmployers()
  }
}
