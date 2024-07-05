import EmployerSector from '../../enums/employerSector'
import EmployerStatus from '../../enums/employerStatus'

interface GetEmployerResponse {
  id: string
  name: string
  description: string
  createdBy: string
  createdWhen: string
  modifiedBy: string
  modifiedWhen: string
  sector: EmployerSector
  status: EmployerStatus
}

export default GetEmployerResponse
