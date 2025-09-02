export default function parseBooleanParam(value: unknown, defaultValue = false): boolean {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value.toLowerCase() === 'on'
  }
  if (typeof value === 'boolean') {
    return value
  }
  return defaultValue
}
