import JobSector from '../../enums/jobSector'
import EmployerSector from '../../enums/employerSector'

interface PutJobData {
  id: number

  // First page
  employerId: string
  jobTitle: string
  jobSector: JobSector
  nfnIndustrySector: EmployerSector
  numberOfVacancies: number
  jobSource1: string
  jobSource2: string
  charity: string

  // ToDo: other pages
  // salaryFrom: string
  // salaryTo: number
  // additionalSalaryInformation: string
  // salaryPeriod: SalaryPeriod
  // offenceExclusions: ExcludingOffences[]
  // essentialCriteria: string
  // desirableCriteria: string
  // jobDescription: string
  // workPattern: ContractType
  // hours: Hours
  // howToApply: string
}

export default PutJobData
