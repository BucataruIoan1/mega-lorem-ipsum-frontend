const PAGE_SIZE_OPTIONS = ['10', '20', '50', 'all']

function getSortLabel(column, sortBy, sortDir) {
  if (sortBy !== column.key) {
    return `${column.label} unsorted`
  }

  return `${column.label} sorted ${
    sortDir === 'asc' ? 'ascending' : 'descending'
  }`
}

export {
  PAGE_SIZE_OPTIONS,
  getSortLabel,
}