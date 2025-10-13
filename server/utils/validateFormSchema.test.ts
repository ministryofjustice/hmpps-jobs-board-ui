import { Request } from 'express'
import Joi from 'joi'
import validateFormSchema, { validateReviewSchema } from './validateFormSchema'

describe('#validateFormSchema', () => {
  let req: Request

  beforeEach(() => {
    req = { body: {} } as Request
  })

  it('should return undefined when there are no validation errors', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(0).max(120).required(),
    })

    req.body = { name: 'Test-1', age: 30 }
    const result = validateFormSchema(req, schema)
    expect(result).toBeUndefined()
  })

  it('should return validation errors when they exist', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(0).max(120).required(),
    })

    req.body = { name: 'Test-1', age: -1 }
    const result = validateFormSchema(req, schema)

    expect(result).toBeDefined()
    expect(Object.keys(result).length).toBe(1)
    expect(result.age.text).toBe('"age" must be greater than or equal to 0')
    expect(result.age.href).toBe('#age')
  })
})

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('#validateReviewSchema', () => {
  let reviewForm: { [key: string]: any }

  beforeEach(() => {
    reviewForm = {}
  })

  it('should return undefined when there are no validation errors', () => {
    const schema1 = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(0).max(120).required(),
    })
    const schema2 = Joi.object({
      email: Joi.string().email().required(),
    })
    const schemas = [schema1, schema2]

    reviewForm = { name: 'Test-1', age: 30, email: 'abc@gmail.com' }
    const result = validateReviewSchema(reviewForm, schemas)
    expect(result).toBeUndefined()
  })

  it('should return validation errors when they exist', () => {
    const schema1 = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(0).max(120).required(),
    })
    const schema2 = Joi.object({
      email: Joi.string().email().required(),
    })
    const schemas = [schema1, schema2]

    reviewForm = { name: 'Test-1', age: -1, email: null }
    const result = validateReviewSchema(reviewForm, schemas)

    expect(result).toBeDefined()
    expect(Object.keys(result).length).toBe(2)
    expect(result.age.text).toBe('"age" must be greater than or equal to 0')
    expect(result.age.href).toBe('#age')
    expect(result.email.text).toBe('"email" must be a string')
    expect(result.email.href).toBe('#email')
  })
})
