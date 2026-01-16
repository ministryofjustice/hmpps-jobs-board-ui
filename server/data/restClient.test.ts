import nock from 'nock'

import { AgentConfig } from '../config'
import RestClient from './restClient'

const restClient = new RestClient(
  'api-name',
  {
    url: 'http://localhost:8080/api',
    timeout: {
      response: 1000,
      deadline: 1000,
    },
    agent: new AgentConfig(1000),
  },
  'token-1',
)

describe.each(['get', 'patch', 'post', 'put', 'delete'] as const)('Method: %s', method => {
  it('should return response body', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      [method]('/api/test')
      .reply(200, { success: true })

    let result: { success: boolean }

    if (method === 'get' || method === 'delete') {
      result = await restClient[method]<{ success: boolean }>({ path: '/test' })
    } else {
      result = await restClient[method]<{ success: boolean }>({ path: '/test', data: {} })
    }

    expect(nock.isDone()).toBe(true)

    expect(result).toStrictEqual({
      success: true,
    })
  })

  it('should return raw response body', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      [method]('/api/test')
      .reply(200, { success: true })

    const result = await restClient[method]({
      path: '/test',
      headers: { header1: 'headerValue1' },
      raw: true,
    })

    expect(nock.isDone()).toBe(true)

    expect(result).toMatchObject({
      req: { method: method.toUpperCase() },
      status: 200,
      text: '{"success":true}',
    })
  })

  if (method === 'get' || method === 'delete') {
    it('should retry by default', async () => {
      nock('http://localhost:8080', {
        reqheaders: { authorization: 'Bearer token-1' },
      })
        [method]('/api/test')
        .reply(500)
        [method]('/api/test')
        .reply(500)
        [method]('/api/test')
        .reply(500)

      await expect(
        restClient[method]({
          path: '/test',
          headers: { header1: 'headerValue1' },
        }),
      ).rejects.toThrow('Internal Server Error')

      expect(nock.isDone()).toBe(true)
    })
  } else {
    it('should not retry by default', async () => {
      nock('http://localhost:8080', {
        reqheaders: { authorization: 'Bearer token-1' },
      })
        [method]('/api/test')
        .reply(500)

      await expect(
        restClient[method]({
          path: '/test',
          headers: { header1: 'headerValue1' },
        }),
      ).rejects.toThrow('Internal Server Error')

      expect(nock.isDone()).toBe(true)
    })

    it('should retry if configured to do so', async () => {
      nock('http://localhost:8080', {
        reqheaders: { authorization: 'Bearer token-1' },
      })
        [method]('/api/test')
        .reply(500)
        [method]('/api/test')
        .reply(500)
        [method]('/api/test')
        .reply(500)

      await expect(
        restClient[method]({
          path: '/test',
          headers: { header1: 'headerValue1' },
          retry: true,
        }),
      ).rejects.toThrow('Internal Server Error')

      expect(nock.isDone()).toBe(true)
    })
  }

  it('can recover through retries', async () => {
    nock('http://localhost:8080', {
      reqheaders: { authorization: 'Bearer token-1' },
    })
      [method]('/api/test')
      .reply(500)
      [method]('/api/test')
      .reply(500)
      [method]('/api/test')
      .reply(200, { success: true })

    let result: { success: boolean }

    switch (method) {
      case 'get':
        // GET in your RestClient does not support retry flag in its Request type
        result = await restClient.get<{ success: boolean }>({
          path: '/test',
          headers: { header1: 'headerValue1' },
        })
        break

      case 'delete':
        result = await restClient.delete<{ success: boolean }>({
          path: '/test',
          headers: { header1: 'headerValue1' },
        })
        break

      case 'post':
        result = await restClient.post<{ success: boolean }>({
          path: '/test',
          headers: { header1: 'headerValue1' },
          retry: true,
          data: {}, // keep requestWithBody happy
        })
        break

      case 'put':
        result = await restClient.put<{ success: boolean }>({
          path: '/test',
          headers: { header1: 'headerValue1' },
          retry: true,
          data: {},
        })
        break

      case 'patch':
        result = await restClient.patch<{ success: boolean }>({
          path: '/test',
          headers: { header1: 'headerValue1' },
          retry: true,
          data: {},
        })
        break

      default:
        throw new Error(`Unexpected method: ${String(method)}`)
    }

    expect(result).toStrictEqual({ success: true })
    expect(nock.isDone()).toBe(true)
  })
})
