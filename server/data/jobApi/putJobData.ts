import JobSector from '../../enums/jobSector'
import EmployerSector from '../../enums/employerSector'
import BaseLocation from '../../enums/baseLocation'
import SalaryPeriod from '../../enums/salaryPeriod'
import ContractType from '../../enums/contractType'
import Hours from '../../enums/hours'
import WorkPattern from '../../enums/workPattern'
import OffenceExclusions from '../../enums/offenceExclusions'
import SupportingDocumentation from '../../enums/supportingDocumentation'
import JobSource from '../../enums/jobSource'

interface PutJobData {
  // First page
  employerId: string // Id of employer
  jobTitle: string // Length 50
  jobSector: JobSector
  industrySector: EmployerSector
  numberOfVacancies: number // Integer
  jobSourceOneOne: JobSource
  jobSourceOneTwo?: JobSource
  charity?: string // length 100

  // Second page
  postcode: string
  salaryFrom: number // Float, 2 decimal places
  salaryTo?: number // Float, 2 decimal places
  salaryPeriod: SalaryPeriod
  additionalSalaryInformation?: string // length 100
  nationalMinimumWage: boolean
  workPattern: WorkPattern
  contractType: ContractType
  hours: Hours
  baseLocation?: BaseLocation

  // Third page
  essentialCriteria: string // length 1000
  desirableCriteria?: string // length 1000
  jobDescription: string // length 3000
  offenceExclusions: OffenceExclusions[]

  // Fourth page
  howToApply: string // length 1000
  closingDate: string // Datetime string
  startDate?: string // Datetime string
  rollingOpportunity: boolean
  prisonLeaversJob: boolean
  supportingDocumentation: SupportingDocumentation[]
  supportingDocumentationDetails: string // length 200
}

export default PutJobData
