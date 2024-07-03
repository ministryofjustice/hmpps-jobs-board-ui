import EmployerSector from '../../enums/employerSector'
import EmployerStatus from '../../enums/employerStatus'

interface PutEmployerData {
  name: string
  description: string
  sector: EmployerSector
  status: EmployerStatus
}

export default PutEmployerData
