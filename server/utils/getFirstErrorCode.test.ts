/* eslint-disable @typescript-eslint/no-explicit-any */
import getFirstErrorCode from './getFirstErrorCode'

describe('getFirstErrorCode', () => {
  test('should return the first error code when details array exists', () => {
    const errorResponse = {
      headers: {},
      data: {
        status: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        details: [
          {
            field: 'name',
            message: 'The name provided already exists. Please choose a different name.',
            code: 'DUPLICATE_EMPLOYER',
          },
        ],
        timestamp: '2025-01-30T12:34:56.789Z',
      },
    }

    expect(getFirstErrorCode(errorResponse)).toBe('DUPLICATE_EMPLOYER')
  })

  test('should return undefined if details array is missing', () => {
    const errorResponse = {
      headers: {},
      data: {
        status: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        timestamp: '2025-01-30T12:34:56.789Z',
      },
    }

    expect(getFirstErrorCode(errorResponse)).toBeUndefined()
  })

  test('should return undefined if details array is empty', () => {
    const errorResponse = {
      headers: {},
      data: {
        status: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        details: [] as any,
        timestamp: '2025-01-30T12:34:56.789Z',
      },
    }

    expect(getFirstErrorCode(errorResponse)).toBeUndefined()
  })

  test('should return undefined if details array exists but first object has no code field', () => {
    const errorResponse = {
      headers: {},
      data: {
        status: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        details: [
          {
            field: 'name',
            message: 'The name provided already exists. Please choose a different name.',
          },
        ],
        timestamp: '2025-01-30T12:34:56.789Z',
      },
    }

    expect(getFirstErrorCode(errorResponse as any)).toBeUndefined()
  })
})
