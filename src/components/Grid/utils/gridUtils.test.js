import {
  PAGE_SIZE_OPTIONS,
  getSortLabel,
} from './gridUtils.js'

describe('gridUtils', () => {
  it('returns the unsorted label when column is inactive', () => {
    expect(
      getSortLabel(
        { key: 'status', label: 'Status' },
        'id',
        'asc',
      ),
    ).toBe('Status unsorted')
  })

  it('returns the ascending label for the active column', () => {
    expect(
      getSortLabel(
        { key: 'status', label: 'Status' },
        'status',
        'asc',
      ),
    ).toBe('Status sorted ascending')
  })

  it('returns the descending label for the active column', () => {
    expect(
      getSortLabel(
        { key: 'status', label: 'Status' },
        'status',
        'desc',
      ),
    ).toBe('Status sorted descending')
  })

  it('keeps the supported page size options stable', () => {
    expect(PAGE_SIZE_OPTIONS).toEqual(['10', '20', '50', 'all'])
  })
})
