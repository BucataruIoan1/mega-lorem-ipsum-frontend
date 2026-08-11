import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
  VALID_MODAL_TYPES,
  getPageSizeValue,
  getPositiveNumber,
} from './tableUtils.js'

describe('tableUtils', () => {
  it('returns a positive integer when value is valid', () => {
    expect(getPositiveNumber('12', 1)).toBe(12)
  })

  it('falls back when value is not a positive integer', () => {
    expect(getPositiveNumber('-3', 7)).toBe(7)
    expect(getPositiveNumber('2.5', 7)).toBe(7)
    expect(getPositiveNumber('abc', 7)).toBe(7)
  })

  it('accepts allowed page sizes and all', () => {
    expect(getPageSizeValue('10')).toBe(10)
    expect(getPageSizeValue('20')).toBe(20)
    expect(getPageSizeValue('50')).toBe(50)
    expect(getPageSizeValue('all')).toBe('all')
  })

  it('falls back to the default page size when value is unsupported', () => {
    expect(getPageSizeValue('100')).toBe(10)
    expect(getPageSizeValue(undefined)).toBe(10)
  })

  it('exposes the default sorting contract', () => {
    expect(DEFAULT_SORT_BY).toBe('id')
    expect(DEFAULT_SORT_DIR).toBe('asc')
    expect(VALID_MODAL_TYPES.has('bulk')).toBe(true)
  })
})
