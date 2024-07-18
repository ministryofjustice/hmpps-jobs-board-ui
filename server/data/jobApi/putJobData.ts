import JobSector from '../../enums/jobSector'
import EmployerSector from '../../enums/employerSector'
import BaseLocation from '../../enums/baseLocation'
import SalaryPeriod from '../../enums/salaryPeriod'
import ContractType from '../../enums/contractType'
import Hours from '../../enums/hours'
import WorkPattern from '../../enums/workPattern'
import OffenceExclusions from '../../enums/offenceExclusions'

interface PutJobData {
  id: number

  // First page
  employerId: string
  jobTitle: string
  jobSector: JobSector
  nfnIndustrySector: EmployerSector
  numberOfVacancies: number
  jobSource: string
  jobSource2: string
  charity: string

  // Second page - jobContractUpdate
  postcode: string
  salaryFrom: number
  salaryTo: number
  salaryPeriod: SalaryPeriod
  additionalSalaryInformation: string
  nationalMinimumWage: boolean
  workPattern: WorkPattern
  contractType: ContractType
  hours: Hours
  baseLocation: BaseLocation

  // Third page
  essentialCriteria: string
  desirableCriteria: string
  jobDescription: string
  offenceExclusions: OffenceExclusions[]

  // ToDo: other pages
  // howToApply: string
}

export default PutJobData
