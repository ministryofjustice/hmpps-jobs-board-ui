import convertToTitleCase from './convertToTitleCase'

describe('Convert to title case', () => {
  it('null string', () => {
    expect(convertToTitleCase(null)).toEqual('')
  })
  it('empty string', () => {
    expect(convertToTitleCase('')).toEqual('')
  })
  it('Lower Case', () => {
    expect(convertToTitleCase('anotheruser')).toEqual('Anotheruser')
  })
  it('Upper Case', () => {
    expect(convertToTitleCase('ANOTHERUSER')).toEqual('Anotheruser')
  })
  it('Mixed Case', () => {
    expect(convertToTitleCase('AnOTherUSer')).toEqual('Anotheruser')
  })
  it('Multiple words', () => {
    expect(convertToTitleCase('AnOTherUSeR USER-1')).toEqual('Anotheruser User-1')
  })
  it('Leading spaces', () => {
    expect(convertToTitleCase('  AnOTherUSer')).toEqual('  Anotheruser')
  })
  it('Trailing spaces', () => {
    expect(convertToTitleCase('AnOTherUSer  ')).toEqual('Anotheruser  ')
  })
  it('Hyphenated', () => {
    expect(convertToTitleCase('Anotheruser-Test-1 UseR-1-HohO-OTHERUSER')).toEqual(
      'Anotheruser-Test-1 User-1-Hoho-Otheruser',
    )
  })
})
