/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import { getSessionData, setSessionData } from '../../../utils/session'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'

export default class EmployerListController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, employerSectorFilter = '', employerNameFilter = '' } = req.query
    const { paginationPageSize } = config
    const employerListResults = req.context.employers

    try {
      // Paginate where necessary
      let paginationData = {}

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        employerNameFilter && `employerNameFilter=${decodeURIComponent(employerNameFilter as string)}`,
        employerSectorFilter && `employerSectorFilter=${decodeURIComponent(employerSectorFilter as string)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // Build pagination or error messages
      if (employerListResults.totalElements) {
        if (employerListResults.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPagination(
            employerListResults,
            new URL(`${req.protocol}://${req.get('host')}${addressLookup.employers.employerList()}?${uri.join('&')}`),
          )
        }
      }

      // Render data
      const data = {
        employerListResults,
        sort,
        order,
        paginationData,
        employerNameFilter: decodeURIComponent(employerNameFilter as string),
        employerSectorFilter: decodeURIComponent(employerSectorFilter as string),
        filtered:
          decodeURIComponent(employerNameFilter as string) || decodeURIComponent(employerSectorFilter as string),
      }

      setSessionData(req, ['employerList', 'data'], data)

      res.render('pages/employers/employerList/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { sort, order } = req.query
    const { employerSectorFilter, employerNameFilter } = req.body

    try {
      if (Object.prototype.hasOwnProperty.call(req.body, 'addEmployerButton')) {
        res.redirect(addressLookup.employers.employerUpdate())
        return
      }

      // If validation errors render errors
      const data = getSessionData(req, ['employerList', 'data'])
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        res.render('pages/employers/employerList/index', {
          ...data,
          errors,
          ...req.body,
        })
        return
      }

      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        employerNameFilter && `employerNameFilter=${encodeURIComponent(employerNameFilter)}`,
        employerSectorFilter && `employerSectorFilter=${encodeURIComponent(employerSectorFilter)}`,
      ].filter(val => !!val)

      res.redirect(
        uri.length
          ? `${addressLookup.employers.employerList()}?${uri.join('&')}`
          : addressLookup.employers.employerList(),
      )
    } catch (err) {
      next(err)
    }
  }
}
