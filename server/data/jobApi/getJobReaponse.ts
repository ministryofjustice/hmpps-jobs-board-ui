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

interface GetJobReaponse {
  employerId: string
  jobTitle: string
  jobSector: JobSector
  industrySector: EmployerSector
  numberOfVacancies: number
  JobjobSourceOne: JobSource
  jobSourceTwo?: JobSource
  charity?: string
  postcode: string
  salaryFrom: number
  salaryTo?: number
  salaryPeriod: SalaryPeriod
  additionalSalaryInformation?: string
  nationalMinimumWage: boolean
  workPattern: WorkPattern
  contractType: ContractType
  hours: Hours
  baseLocation?: BaseLocation
  essentialCriteria: string
  desirableCriteria?: string
  jobDescription: string
  offenceExclusions: OffenceExclusions[]
  howToApply: string
  closingDate: string
  startDate?: string
  rollingOpportunity: boolean
  prisonLeaversJob: boolean
  supportingDocumentation: SupportingDocumentation[]
  supportingDocumentationDetails: string
}

export default GetJobReaponse
