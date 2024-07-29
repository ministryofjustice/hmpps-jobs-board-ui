import 'reflect-metadata'
import { Exclude, Expose, Type, Transform } from 'class-transformer'
import { formatDateStringTodMMMyyyy } from '../utils'
import JobSector from '../enums/jobSector'

@Exclude()
export default class JobViewModel {
  @Expose()
  id: string

  @Expose()
  jobTitle: string

  @Expose()
  employerName: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringTodMMMyyyy)
  createdAt: string

  createdBy: string

  @Expose()
  sector: JobSector

  @Expose()
  numberOfVacancies: number
}
