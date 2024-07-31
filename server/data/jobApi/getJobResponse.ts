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

interface GetJobResponse {
  employerId: string
  jobTitle: string
  sector: JobSector
  industrySector: EmployerSector
  numberOfVacancies: number
  JobsourcePrimary: JobSource
  sourceSecondary?: JobSource
  charityName?: string
  postCode: string
  salaryFrom: number
  salaryTo?: number
  salaryPeriod: SalaryPeriod
  additionalSalaryInformation?: string
  isPayingAtLeastNationalMinimumWage: boolean
  workPattern: WorkPattern
  contractType: ContractType
  hoursPerWeek: Hours
  baseLocation?: BaseLocation
  essentialCriteria: string
  desirableCriteria?: string
  description: string
  offenceExclusions: OffenceExclusions[]
  howToApply: string
  closingDate: string
  startDate?: string
  isRollingOpportunity: boolean
  isOnlyForPrisonLeavers: boolean
  supportingDocumentationRequired: SupportingDocumentation[]
  supportingDocumentationDetails: string

  createdAt: string
  createdBy: string
}

export default GetJobResponse
