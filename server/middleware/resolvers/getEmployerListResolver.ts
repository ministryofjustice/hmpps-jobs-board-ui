import type { RequestHandler } from 'express'

import EmployerService from '../../services/employerService'
import employers from '../../data/employerApi/mock_employers.json'

// Gets employers
const getEmployerListResolver =
  (_: EmployerService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    try {
      req.context.employers = {
        content: [...employers],
        pageable: {
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          pageSize: 20,
          pageNumber: 0,
          paged: true,
          unpaged: false,
        },
        totalElements: employers.length,
        last: false,
        totalPages: 3,
        size: 20,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        first: true,
        numberOfElements: 20,
        empty: false,
      }

      next()
    } catch (err) {
      next(err)
    }
  }

export default getEmployerListResolver
