import { RequestHandler } from 'express'
import { v7 as uuidv7 } from 'uuid'
import _ from 'lodash'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
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
import logger from '../../../../logger'
import getFirstErrorCode from '../../../utils/getFirstErrorCode'
import config from '../../../config'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'

export default class JobReviewController {
  constructor(private readonly jobService: JobService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { allEmployers = [] } = req.context

    try {
      const job = getSessionData(req, ['job', id])
      if (!job) {
        logger.error('Error rendering page - Job review - No record found in session')
        res.redirect(addressLookup.jobs.jobRoleUpdate(id, mode))
        return
      }

      const errors = validateFormSchema(job, validationSchema())

      // Render data
      const data = {
        id,
        ...job,
        startDate: job.startDate && formatShortDate(new Date(job.startDate)),
        closingDate: job.closingDate && formatShortDate(new Date(job.closingDate)),
        employerName: (allEmployers.find((p: { id: string }) => p.id === job.employerId) || {}).name,
        errors,
      }

      // Set page data in session
      setSessionData(req, ['jobReview', id, 'data'], data)

      res.render('pages/jobs/jobReview/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Job review')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    const data = getSessionData(req, ['employerReview', id, 'data'])

    try {
      const job = getSessionData(req, ['job', id])
      const errors = validateFormSchema(job, validationSchema())
      if (errors) {
        res.render('pages/jobs/jobReview/index', {
          id,
          ...job,
          employerName: (req.context.allEmployers || []).find((p: { id: string }) => p.id === job.employerId)?.name,
          startDate: job.startDate && formatShortDate(new Date(job.startDate)),
          closingDate: job.closingDate && formatShortDate(new Date(job.closingDate)),
          errors,
        })
        return
      }

      // Update application progress API
      const jobUpdate = {
        employerId: job.employerId,
        jobTitle: job.jobTitle,
        sector: job.sector as JobSector,
        industrySector: job.industrySector as EmployerSector,
        numberOfVacancies: job.numberOfVacancies,
        sourcePrimary: job.sourcePrimary as JobSource,
        sourceSecondary: job.sourceSecondary as JobSource,
        charityName: job.charityName,
        postCode: res.locals.useNationalJobs === true && job.isNational === YesNoValue.YES ? null : job.postCode,
        salaryFrom: job.salaryFrom,
        salaryTo: job.salaryTo,
        salaryPeriod: job.salaryPeriod as SalaryPeriod,
        additionalSalaryInformation: job.additionalSalaryInformation,
        isPayingAtLeastNationalMinimumWage: job.isPayingAtLeastNationalMinimumWage === YesNoValue.YES,
        workPattern: job.workPattern as WorkPattern,
        contractType: job.contractType as ContractType,
        hoursPerWeek: job.hoursPerWeek as Hours,
        baseLocation: job.baseLocation as BaseLocation,
        essentialCriteria: job.essentialCriteria,
        desirableCriteria: job.desirableCriteria,
        description: job.description,
        offenceExclusions: job.offenceExclusions as OffenceExclusions[],
        offenceExclusionsDetails: job.offenceExclusionsDetails,
        howToApply: job.howToApply,
        closingDate: job.closingDate,
        startDate: job.startDate,
        isRollingOpportunity: job.isRollingOpportunity === YesNoValue.YES,
        isOnlyForPrisonLeavers: job.isOnlyForPrisonLeavers === YesNoValue.YES,
        supportingDocumentationRequired: job.supportingDocumentationRequired as SupportingDocumentation[],
        supportingDocumentationDetails: job.supportingDocumentationDetails,
        isNational: res.locals.useNationalJobs === true ? job.isNational === YesNoValue.YES : false,
      }

      const create = _.trim(id.toString()) === 'new'
      const identifier = create ? uuidv7() : id

      if (config.apis.hmppsAudit.enabled) {
        await auditService.sendAuditMessage({
          action: `${create ? 'CREATE' : 'UPDATE'}_JOB`,
          who: res.locals.user.username,
          service: config.apis.hmppsAudit.auditServiceName,
          subjectId: identifier,
          subjectType: 'NOT_APPLICABLE',
        })
      }

      await this.jobService.createUpdateJob(res.locals.user.username, identifier, jobUpdate)

      // Delete current record
      deleteSessionData(req, ['job', id])

      // Redirect to jobs
      res.redirect(`${addressLookup.jobs.jobList()}?sort=jobTitle&order=ascending`)
    } catch (err) {
      const errorCode = getFirstErrorCode(err)

      // Check for server validation error
      if (err.status === 400 && errorCode) {
        res.render('pages/serverValidationError/index', {
          ...data,
          ...err,
          errorCode,
        })
        return
      }

      logger.error('Error posting form - Job review')
      next(err)
    }
  }
}
