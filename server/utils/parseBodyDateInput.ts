import { format } from 'date-fns'

export default function parseBodyDateInput(req: { body: { [x: string]: number } }, fieldname: string) {
  return req.body[`${fieldname}-day`] && req.body[`${fieldname}-month`] && req.body[`${fieldname}-year`]
    ? format(
        new Date(req.body[`${fieldname}-year`], req.body[`${fieldname}-month`] - 1, req.body[`${fieldname}-day`]),
        'yyyy-MM-dd',
      )
    : ''
}
