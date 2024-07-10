import 'reflect-metadata'
import { Exclude, Expose, Type, Transform } from 'class-transformer'
import EmployerSector from '../enums/employerSector'
import EmployerStatus from '../enums/employerStatus'
import { formatDateStringTodMMMyyyy } from '../utils'

@Exclude()
export default class EmployerViewModel {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  description: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringTodMMMyyyy)
  createdAt: string

  createdBy: string

  @Expose()
  sector: EmployerSector

  @Expose()
  status: EmployerStatus
}
