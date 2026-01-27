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
import parseBooleanParam from '../../../utils/parseBooleanParam'
import jobsFilter from '../../../enums/jobsFilter'
import PagedResponse from '../../../data/domain/types/pagedResponse'

// Define a clear numeric sort key for job status (never relying on string comparison or enum order)
export function getJobStatusSortKey(job: { closingDate?: string | Date; isRollingOpportunity?: boolean }): number {
  if (job.isRollingOpportunity || !job.closingDate) return 0 // LIVE

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const closing = new Date(job.closingDate)
  closing.setHours(0, 0, 0, 0)

  return closing <= today ? 1 : 0 // CLOSED
}

export default class JobListController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, jobSectorFilter = '', jobTitleOrEmployerNameFilter = '' } = req.query

    const myOwnJobsFilter = res.locals.brokerIterationEnabled
      ? parseBooleanParam(req.query.myOwnJobsFilter?.toString())
      : false

    const { paginationPageSize } = config
    const jobListResults: PagedResponse<JobViewModel> = req.context.jobs

    try {
      // Paginate where necessary
      let paginationData = {}

      if (!sort) {
        res.redirect(`${addressLookup.jobs.jobList()}?sort=jobTitle&order=ascending`)
        return
      }

      /*
        ESWE-1378 - Sorting considerations for a UI derived column

        jobTitle / createdAt
        → sorted upstream (API / DB)
        → pagination happens after sorting
        → whole result set is ordered correctly

        jobStatus
        → derived in the UI layer
        → this is sorting only jobListResults.content
        → content already contains one page
        → each page is sorted independently
        ** global ordering is impossible this way **

         Cannot globally sort a derived field if there is only a paged subset of the data.
         As a result set will never be extremely large, we can sort after pagination as a workaround.
      */
      const requiresDerivedColSort = sort === 'jobStatus'
      let sortedJobsList = jobListResults.content

      if (requiresDerivedColSort) {
        sortedJobsList = [...jobListResults.content].sort((a, b) => {
          const primarySort =
            order === 'ascending'
              ? getJobStatusSortKey(a) - getJobStatusSortKey(b)
              : getJobStatusSortKey(b) - getJobStatusSortKey(a)

          if (primarySort !== 0) return primarySort

          // Secondary sort by closing date (safe for nulls because of primary sort)
          const dateA = a.closingDate ? new Date(a.closingDate).getTime() : Number.MAX_SAFE_INTEGER
          const dateB = b.closingDate ? new Date(b.closingDate).getTime() : Number.MAX_SAFE_INTEGER

          return dateA - dateB
        })
      }

      // Apply pagination AFTER sorting
      const pageNumber = Math.max(Number(page ?? 1) - 1, 0)
      const pageSize = Number(paginationPageSize)

      const pagedJobsList = requiresDerivedColSort
        ? sortedJobsList.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
        : sortedJobsList

      // Rebuild the PagedResponse content to match pagedJobsList
      const pagedJobListResponse: PagedResponse<JobViewModel> = requiresDerivedColSort
        ? {
            ...jobListResults,
            content: pagedJobsList,
            page: {
              ...jobListResults.page,
              size: pageSize,
              totalElements: jobListResults.page.totalElements,
              totalPages: Math.ceil(jobListResults.page.totalElements / pageSize),
              number: pageNumber,
            },
          }
        : {
            ...jobListResults,
            content: pagedJobsList,
          }

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        jobTitleOrEmployerNameFilter &&
          `jobTitleOrEmployerNameFilter=${decodeURIComponent(jobTitleOrEmployerNameFilter as string)}`,
        jobSectorFilter && `jobSectorFilter=${decodeURIComponent(jobSectorFilter as string)}`,
        `myOwnJobsFilter=${myOwnJobsFilter === true}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // Build pagination or error messages
      const paginationSource = requiresDerivedColSort ? pagedJobListResponse : jobListResults

      if (paginationSource.page.totalElements > pageSize) {
        paginationData = this.paginationService.getPagination(
          paginationSource,
          new URL(`${req.protocol}://${req.get('host')}${addressLookup.jobs.jobList()}?${uri.join('&')}`),
        )
      }

      // Render data
      const data = {
        jobListResults: {
          ...pagedJobListResponse,
          content: plainToClass(JobViewModel, pagedJobListResponse.content),
        },
        sort,
        order,
        paginationData,
        jobTitleOrEmployerNameFilter: decodeURIComponent(jobTitleOrEmployerNameFilter as string),
        jobSectorFilter: decodeURIComponent(jobSectorFilter as string),
        filtered:
          decodeURIComponent(jobTitleOrEmployerNameFilter as string) ||
          decodeURIComponent(jobSectorFilter as string) ||
          myOwnJobsFilter,
        myOwnJobsFilter: !!myOwnJobsFilter,
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
    const myOwnJobsFilter = req.body.myOwnJobsFilter === jobsFilter.SHOW_ONLY_MY_JOBS

    try {
      if (Object.prototype.hasOwnProperty.call(req.body, 'addJobButton')) {
        res.redirect(addressLookup.jobs.jobRoleUpdate('start'))
        return
      }

      // If validation errors render errors
      const data = getSessionData(req, ['jobList', 'data'])
      const errors = validateFormSchema(req.body, validationSchema())

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
        myOwnJobsFilter && 'myOwnJobsFilter=true',
      ].filter(val => !!val)

      res.redirect(uri.length ? `${addressLookup.jobs.jobList()}?${uri.join('&')}` : addressLookup.jobs.jobList())
    } catch (err) {
      logger.error('Error posting form - Job list')
      next(err)
    }
  }
}
