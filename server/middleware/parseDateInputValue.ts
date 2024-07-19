import type { RequestHandler } from 'express'

// Gets field on body and converts to an array if only one value is found
const parseDateInputValue =
  (fieldName: string): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const data: { [x: string]: number } = {}
    data[`${fieldName}-day`] = req.body[`${fieldName}-day`]
    data[`${fieldName}-month`] = req.body[`${fieldName}-month`]
    data[`${fieldName}-year`] = req.body[`${fieldName}-year`]

    req.body[fieldName] = data

    next()
  }

export default parseDateInputValue
