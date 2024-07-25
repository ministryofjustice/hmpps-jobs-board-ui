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

export default class JobListController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, sectorFilter = '', jobSearchFilter = '' } = req.query
    const { paginationPageSize } = config
    const jobListResults = req.context.jobs

    try {
      // Paginate where necessary
      let paginationData = {}

      if (!sort) {
        res.redirect(`${addressLookup.jobs.jobList()}?sort=name&order=ascending`)
        return
      }

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        jobSearchFilter && `jobSearchFilter=${decodeURIComponent(jobSearchFilter as string)}`,
        sectorFilter && `sectorFilter=${decodeURIComponent(sectorFilter as string)}`,
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
        jobSearchFilter: decodeURIComponent(jobSearchFilter as string),
        sectorFilter: decodeURIComponent(sectorFilter as string),
        filtered: decodeURIComponent(jobSearchFilter as string) || decodeURIComponent(sectorFilter as string),
      }

      setSessionData(req, ['jobList', 'data'], data)
      res.render('pages/jobs/jobList/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { sort, order } = req.query
    const { sectorFilter, jobSearchFilter } = req.body

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
        jobSearchFilter && `jobSearchFilter=${encodeURIComponent(jobSearchFilter)}`,
        sectorFilter && `sectorFilter=${encodeURIComponent(sectorFilter)}`,
      ].filter(val => !!val)

      res.redirect(uri.length ? `${addressLookup.jobs.jobList()}?${uri.join('&')}` : addressLookup.jobs.jobList())
    } catch (err) {
      next(err)
    }
  }
}
