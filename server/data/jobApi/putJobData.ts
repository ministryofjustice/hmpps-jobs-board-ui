import JobSector from '../../enums/jobSector'
import EmployerSector from '../../enums/employerSector'
import BaseLocation from '../../enums/baseLocation'
import SalaryPeriod from '../../enums/salaryPeriod'
import ContractType from '../../enums/contractType'
import Hours from '../../enums/hours'
import WorkPattern from '../../enums/workPattern'

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

  // ToDo: other pages
  // offenceExclusions: ExcludingOffences[]
  // essentialCriteria: string
  // desirableCriteria: string
  // jobDescription: string
  // workPattern: ContractType
  // hours: Hours
  // howToApply: string
}

export default PutJobData
