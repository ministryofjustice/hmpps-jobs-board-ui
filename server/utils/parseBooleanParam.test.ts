import parseBooleanParam from './parseBooleanParam'

describe('parseBooleanParam', () => {
  it('returns true when value is string "true"', () => {
    expect(parseBooleanParam('true')).toBe(true)
  })

  it('returns true when value is string "on"', () => {
    expect(parseBooleanParam('on')).toBe(true)
  })

  it('is case-insensitive for string values', () => {
    expect(parseBooleanParam('TRUE')).toBe(true)
    expect(parseBooleanParam('On')).toBe(true)
  })

  it('returns false when value is string "false"', () => {
    expect(parseBooleanParam('false')).toBe(false)
  })

  it('returns false when value is string "off"', () => {
    expect(parseBooleanParam('off')).toBe(false)
  })

  it('returns true when value is boolean true', () => {
    expect(parseBooleanParam(true)).toBe(true)
  })

  it('returns false when value is boolean false', () => {
    expect(parseBooleanParam(false)).toBe(false)
  })

  it('returns defaultValue when value is undefined', () => {
    expect(parseBooleanParam(undefined)).toBe(false) // default is false
    expect(parseBooleanParam('')).toBe(false)
    expect(parseBooleanParam(undefined, true)).toBe(true) // override default
  })

  it('returns defaultValue when value is null', () => {
    expect(parseBooleanParam(null)).toBe(false)
    expect(parseBooleanParam(null, true)).toBe(true)
  })

  it('returns defaultValue for unexpected types (number, object)', () => {
    expect(parseBooleanParam(1)).toBe(false)
    expect(parseBooleanParam(0, true)).toBe(true)
    expect(parseBooleanParam({})).toBe(false)
  })
})
