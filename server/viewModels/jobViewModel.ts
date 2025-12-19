/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import { Exclude, Expose, Type, Transform } from 'class-transformer'
import { formatDateStringTodMMMyyyy } from '../utils'
import JobSector from '../enums/jobSector'
import JobStatus from '../enums/jobStatus'

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

  @Expose()
  isRollingOpportunity?: boolean

  // 1 Raw closing date stays a Date
  @Expose()
  @Type(() => Date)
  closingDate?: Date

  // 2 Formatted date for UI
  @Expose()
  get formattedClosingDate(): string | undefined {
    if (!this.closingDate) {
      return 'N/A'
    }

    const params: any = { value: this.closingDate }
    return formatDateStringTodMMMyyyy(params)
  }

  // 3 Job status logic
  @Expose()
  get jobStatus(): JobStatus {
    if (this.isRollingOpportunity || !this.closingDate) {
      return JobStatus.LIVE
    }
    const today = new Date()
    // Set time to 00:00:00 for both dates to compare only the date part
    today.setHours(0, 0, 0, 0)
    const closing = new Date(this.closingDate)
    closing.setHours(0, 0, 0, 0)

    return closing <= today ? JobStatus.CLOSED : JobStatus.LIVE
  }
}
