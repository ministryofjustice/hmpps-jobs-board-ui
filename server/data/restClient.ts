import { Readable } from 'stream'

import Agent, { HttpsAgent } from 'agentkeepalive'
import type { Response as SuperagentResponse } from 'superagent'
import superagent from 'superagent'

import logger from '../../logger'
import type { UnsanitisedError } from '../sanitisedError'
import sanitiseError from '../sanitisedError'
import type { ApiConfig } from '../config'
import { restClientMetricsMiddleware } from './restClientMetricsMiddleware'

interface Request {
  path: string
  query?: object | string
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
}

interface RequestWithBody extends Request {
  data?: Record<string, unknown>
  retry?: boolean
}

interface StreamRequest {
  path?: string
  headers?: Record<string, string>
  errorLogger?: (e: UnsanitisedError) => void
}

type RequestBase = Omit<Request, 'raw'> & { raw?: false }
type RequestRaw = Omit<Request, 'raw'> & { raw: true }
type RequestAny = RequestBase | RequestRaw
type RequestWithBodyBase = Omit<RequestWithBody, 'raw'> & { raw?: false }
type RequestWithBodyRaw = Omit<RequestWithBody, 'raw'> & { raw: true }
type RequestWithBodyAny = RequestWithBodyBase | RequestWithBodyRaw

export default class RestClient {
  agent: Agent

  constructor(private readonly name: string, private readonly config: ApiConfig, private readonly token: string) {
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new Agent(config.agent)
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  async get<TBody = unknown>(req: RequestBase): Promise<TBody>

  async get(req: RequestRaw): Promise<SuperagentResponse>

  async get<TBody = unknown>({
    path,
    query = {},
    headers = {},
    responseType = '',
    raw = false,
  }: Request): Promise<TBody | SuperagentResponse> {
    logger.info(`${this.name} GET: ${path}`)
    try {
      const result = await superagent
        .get(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      if (raw) return result
      return result.body as TBody
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'GET'`)
      throw sanitisedError
    }
  }

  private async requestWithBody<TBody = unknown>(
    method: 'patch' | 'post' | 'put',
    req: RequestWithBodyBase,
  ): Promise<TBody>

  private async requestWithBody(method: 'patch' | 'post' | 'put', req: RequestWithBodyRaw): Promise<SuperagentResponse>

  private async requestWithBody<TBody = unknown>(
    method: 'patch' | 'post' | 'put',
    { path, query = {}, headers = {}, responseType = '', data = {}, raw = false, retry = false }: RequestWithBody,
  ): Promise<TBody | SuperagentResponse> {
    logger.info(`${this.name} ${method.toUpperCase()}: ${path}`)
    try {
      const result = await superagent[method](`${this.apiUrl()}${path}`)
        .query(query)
        .send(data)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, res) => {
          if (retry === false) {
            return false
          }
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      if (raw) return result
      return result.body as TBody
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: '${method.toUpperCase()}'`)
      throw sanitisedError
    }
  }

  async patch<TBody = unknown>(request: RequestWithBodyBase): Promise<TBody>

  async patch(request: RequestWithBodyRaw): Promise<SuperagentResponse>

  async patch<TBody = unknown>(request: RequestWithBodyAny): Promise<TBody | SuperagentResponse> {
    if (request.raw === true) {
      return this.requestWithBody('patch', request) // matches RequestWithBodyRaw overload
    }
    return this.requestWithBody<TBody>('patch', request) // matches RequestWithBodyBase overload
  }

  async post<TBody = unknown>(request: Omit<RequestWithBody, 'raw'> & { raw?: false }): Promise<TBody>

  async post(request: Omit<RequestWithBody, 'raw'> & { raw: true }): Promise<SuperagentResponse>

  async post<TBody = unknown>(request: RequestWithBodyAny): Promise<TBody | SuperagentResponse> {
    if (request.raw === true) {
      return this.requestWithBody('post', request) // matches RequestWithBodyRaw overload
    }
    return this.requestWithBody<TBody>('post', request) // matches RequestWithBodyBase overload
  }

  async put<TBody = unknown>(request: Omit<RequestWithBody, 'raw'> & { raw?: false }): Promise<TBody>

  async put(request: Omit<RequestWithBody, 'raw'> & { raw: true }): Promise<SuperagentResponse>

  async put<TBody = unknown>(request: RequestWithBodyAny): Promise<TBody | SuperagentResponse> {
    if (request.raw === true) {
      return this.requestWithBody('put', request) // matches RequestWithBodyRaw overload
    }
    return this.requestWithBody<TBody>('put', request) // matches RequestWithBodyBase overload
  }

  async delete<TBody = unknown>(req: RequestBase): Promise<TBody>

  async delete(req: RequestRaw): Promise<SuperagentResponse>

  async delete<TBody = unknown>({
    path,
    query = {},
    headers = {},
    responseType = '',
    raw = false,
  }: RequestAny): Promise<TBody | SuperagentResponse> {
    logger.info(`${this.name} DELETE: ${path}`)
    try {
      const result = await superagent
        .delete(`${this.apiUrl()}${path}`)
        .query(query)
        .agent(this.agent)
        .use(restClientMetricsMiddleware)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      if (raw === true) return result
      return result.body as TBody
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: 'DELETE'`)
      throw sanitisedError
    }
  }

  async stream({ path = null, headers = {} }: StreamRequest = {}): Promise<Readable> {
    logger.info(`${this.name} streaming: ${path}`)
    return new Promise((resolve, reject) => {
      superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .auth(this.token, { type: 'bearer' })
        .use(restClientMetricsMiddleware)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found ${this.name} API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .timeout(this.timeoutConfig())
        .set(headers)
        .end((error, response) => {
          if (error) {
            logger.warn(sanitiseError(error), `Error calling ${this.name}`)
            reject(error)
          } else if (response) {
            const s = new Readable()
            // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-empty-function
            s._read = () => {}
            s.push(response.body)
            s.push(null)
            resolve(s)
          }
        })
    })
  }
}
