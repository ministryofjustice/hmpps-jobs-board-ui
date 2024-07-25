import JobSector from '../../enums/jobSector'

interface GetJobListItemResponse {
  id: string
  employerName: string
  jobTitle: string
  sector: JobSector
  numberOfVacancies: number
  createdAt: string
  createdBy: string
}

export default GetJobListItemResponse
