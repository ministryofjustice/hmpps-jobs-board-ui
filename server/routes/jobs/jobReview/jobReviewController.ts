import { RequestHandler } from 'express'
import { v7 as uuidv7 } from 'uuid'

import { deleteSessionData, formatShortDate, getSessionData, setSessionData } from '../../../utils/index'
import addressLookup from '../../addressLookup'
import JobService from '../../../services/jobService'
import JobSector from '../../../enums/jobSector'
import EmployerSector from '../../../enums/employerSector'
import JobSource from '../../../enums/jobSource'
import SalaryPeriod from '../../../enums/salaryPeriod'
import WorkPattern from '../../../enums/workPattern'
import ContractType from '../../../enums/contractType'
import Hours from '../../../enums/hours'
import BaseLocation from '../../../enums/baseLocation'
import OffenceExclusions from '../../../enums/offenceExclusions'
import SupportingDocumentation from '../../../enums/supportingDocumentation'
import YesNoValue from '../../../enums/yesNoValue'

export default class JobReviewController {
  constructor(private readonly jobService: JobService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { allEmployers = [] } = req.context

    try {
      const job = getSessionData(req, ['job', id])
      if (!job) {
        res.redirect(addressLookup.jobs.jobRoleUpdate(id, mode))
        return
      }

      // Render data
      const data = {
        id,
        ...job,
        startDate: formatShortDate(new Date(job.startDate)),
        closingDate: job.closingDate && formatShortDate(new Date(job.closingDate)),
        employerName: (allEmployers.find((p: { id: string }) => p.id === job.employerId) || {}).name,
      }

      // Set page data in session
      setSessionData(req, ['jobReview', id, 'data'], data)

      res.render('pages/jobs/jobReview/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      const job = getSessionData(req, ['job', id])

      // Update application progress API
      const jobUpdate = {
        employerId: job.employerId,
        jobTitle: job.jobTitle,
        jobSector: job.jobSector as JobSector,
        industrySector: job.industrySector as EmployerSector,
        numberOfVacancies: job.numberOfVacancies,
        jobSourceOne: job.jobSourceOne as JobSource,
        jobSourceTwo: job.jobSourceTwo as JobSource,
        charity: job.charity,
        postcode: job.postcode,
        salaryFrom: job.salaryFrom,
        salaryTo: job.salaryTo,
        salaryPeriod: job.salaryPeriod as SalaryPeriod,
        additionalSalaryInformation: job.additionalSalaryInformation,
        nationalMinimumWage: job.nationalMinimumWage === YesNoValue.YES,
        workPattern: job.workPattern as WorkPattern,
        contractType: job.contractType as ContractType,
        hours: job.hours as Hours,
        baseLocation: job.baseLocation as BaseLocation,
        essentialCriteria: job.essentialCriteria,
        desirableCriteria: job.desirableCriteria,
        jobDescription: job.jobDescription,
        offenceExclusions: job.offenceExclusions as OffenceExclusions[],
        howToApply: job.howToApply,
        closingDate: job.closingDate,
        startDate: job.startDate,
        rollingOpportunity: job.rollingOpportunity === YesNoValue.YES,
        prisonLeaversJob: job.prisonLeaversJob === YesNoValue.YES,
        supportingDocumentation: job.supportingDocumentation as SupportingDocumentation[],
        supportingDocumentationDetails: job.supportingDocumentationDetails,
      }
      await this.jobService.createUpdateJob(res.locals.user.username, id === 'new' ? uuidv7() : id, jobUpdate)

      // Delete current record
      deleteSessionData(req, ['job', id])

      // Redirect to jobs
      res.redirect(`${addressLookup.jobs.jobList()}?sort=name&order=ascending`)
    } catch (err) {
      next(err)
    }
  }
}
