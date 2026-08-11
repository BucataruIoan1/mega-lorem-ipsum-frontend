import {
  ALL_PAGE_SIZE,
  DEFAULT_PAGE_SIZE,
} from '../services/tableService.js'

const EMPTY_LOOKUPS = {
  categories: [],
  statuses: [],
  priorities: [],
  owners: [],
}

const DEFAULT_SORT_BY = 'id'
const DEFAULT_SORT_DIR = 'asc'

const VALID_MODAL_TYPES = new Set([
  'add',
  'edit',
  'delete',
  'bulk',
])

function getPositiveNumber(value, fallbackValue) {
  const parsedValue = Number(value)

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallbackValue
}

function getPageSizeValue(value) {
  if (value === ALL_PAGE_SIZE) {
    return ALL_PAGE_SIZE
  }

  const parsedValue = Number(value)

  return [10, 20, 50].includes(parsedValue)
    ? parsedValue
    : DEFAULT_PAGE_SIZE
}

export {
  EMPTY_LOOKUPS,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
  VALID_MODAL_TYPES,
  getPositiveNumber,
  getPageSizeValue,
}