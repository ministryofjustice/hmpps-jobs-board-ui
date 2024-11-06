/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import { getSessionData, setSessionData } from '../../../utils/session'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import JobViewModel from '../../../viewModels/jobViewModel'
import logger from '../../../../logger'

export default class JobListController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, jobSectorFilter = '', jobTitleOrEmployerNameFilter = '' } = req.query
    const { paginationPageSize } = config
    const jobListResults = req.context.jobs

    try {
      // Paginate where necessary
      let paginationData = {}

      if (!sort) {
        res.redirect(`${addressLookup.jobs.jobList()}?sort=jobTitle&order=ascending`)
        return
      }

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        jobTitleOrEmployerNameFilter &&
          `jobTitleOrEmployerNameFilter=${decodeURIComponent(jobTitleOrEmployerNameFilter as string)}`,
        jobSectorFilter && `jobSectorFilter=${decodeURIComponent(jobSectorFilter as string)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // Build pagination or error messages
      if (jobListResults.page.totalElements) {
        if (jobListResults.page.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPagination(
            jobListResults,
            new URL(`${req.protocol}://${req.get('host')}${addressLookup.jobs.jobList()}?${uri.join('&')}`),
          )
        }
      }

      // Render data
      const data = {
        jobListResults: {
          ...jobListResults,
          content: plainToClass(JobViewModel, jobListResults.content),
        },
        sort,
        order,
        paginationData,
        jobTitleOrEmployerNameFilter: decodeURIComponent(jobTitleOrEmployerNameFilter as string),
        jobSectorFilter: decodeURIComponent(jobSectorFilter as string),
        filtered:
          decodeURIComponent(jobTitleOrEmployerNameFilter as string) || decodeURIComponent(jobSectorFilter as string),
      }

      setSessionData(req, ['jobList', 'data'], data)
      res.render('pages/jobs/jobList/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Job list')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { sort, order } = req.query
    const { jobSectorFilter, jobTitleOrEmployerNameFilter } = req.body

    try {
      if (Object.prototype.hasOwnProperty.call(req.body, 'addJobButton')) {
        res.redirect(addressLookup.jobs.jobRoleUpdate('new'))
        return
      }

      // If validation errors render errors
      const data = getSessionData(req, ['jobList', 'data'])
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        res.render('pages/jobs/jobList/index', {
          ...data,
          errors,
          ...req.body,
        })
        return
      }

      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        jobTitleOrEmployerNameFilter &&
          `jobTitleOrEmployerNameFilter=${encodeURIComponent(jobTitleOrEmployerNameFilter)}`,
        jobSectorFilter && `jobSectorFilter=${encodeURIComponent(jobSectorFilter)}`,
      ].filter(val => !!val)

      res.redirect(uri.length ? `${addressLookup.jobs.jobList()}?${uri.join('&')}` : addressLookup.jobs.jobList())
    } catch (err) {
      logger.error('Error posting form - Job list')
      next(err)
    }
  }
}
