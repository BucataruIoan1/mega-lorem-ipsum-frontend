import { API_ENDPOINTS } from './apiEndpoints.js'

const DEFAULT_PAGE_SIZE = 10
const ALL_PAGE_SIZE = 'all'

function getRelationId(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  if (typeof value === 'object' && value.id !== undefined) {
    return getRelationId(value.id)
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

function getCollection(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  if (Array.isArray(payload.items)) {
    return payload.items
  }

  if (Array.isArray(payload.records)) {
    return payload.records
  }

  if (Array.isArray(payload.results)) {
    return payload.results
  }

  if (Array.isArray(payload.data)) {
    return payload.data
  }

  return []
}

function getNumber(value, fallback) {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

function getPageSizeValue(value, fallback) {
  if (value === ALL_PAGE_SIZE) {
    return ALL_PAGE_SIZE
  }

  return getNumber(value, fallback)
}

function getLabel(value) {
  if (value === null || value === undefined || value === '') {
    return 'N/A'
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'object') {
    return (
      value.name ??
      value.label ??
      value.title ??
      value.value ??
      value.content ??
      (value.id !== undefined ? String(value.id) : 'N/A')
    )
  }

  return String(value)
}

function formatRecordId(value) {
  if (value === null || value === undefined || value === '') {
    return 'N/A'
  }

  const normalizedValue = String(value)

  if (/^\d+$/.test(normalizedValue)) {
    return `#LX-${normalizedValue.padStart(4, '0')}`
  }

  return normalizedValue
}

function normalizeRecord(record) {
  return {
    rawId: getRelationId(record?.id),
    id: formatRecordId(record?.id),
    content: getLabel(record?.content),
    description: '',
    category: getLabel(record?.category),
    categoryId: getRelationId(record?.categoryId ?? record?.category),
    status: getLabel(record?.status),
    statusId: getRelationId(record?.statusId ?? record?.status),
    owner: getLabel(record?.owner),
    ownerId: getRelationId(record?.ownerId ?? record?.owner),
    priority: getLabel(record?.priority),
    priorityId: getRelationId(record?.priorityId ?? record?.priority),
    lastModified: getLabel(record?.lastModified),
  }
}

function normalizeRecordsResponse(payload, requestedPage, requestedPageSize) {
  const pagination = payload?.pagination ?? {}
  const rows = getCollection(payload).map(normalizeRecord)
  const totalRecords = getNumber(
    pagination?.totalRecords ??
      payload?.totalRecords ??
      payload?.totalCount ??
      payload?.count,
    rows.length,
  )
  const currentPage = Math.max(
    1,
    getNumber(
      pagination?.page ?? payload?.currentPage ?? payload?.page,
      requestedPage,
    ),
  )
  const pageSize = getPageSizeValue(
    pagination?.pageSize ?? payload?.pageSize,
    requestedPageSize,
  )
  const fallbackTotalPages =
    pageSize === ALL_PAGE_SIZE ? 1 : Math.ceil(totalRecords / pageSize) || 1
  const totalPages = Math.max(
    1,
    getNumber(pagination?.totalPages ?? payload?.totalPages, fallbackTotalPages),
  )

  return {
    rows,
    currentPage,
    totalPages,
    totalRecords,
    pageSize,
  }
}

export async function fetchRecords({
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  search = '',
  sortBy,
  sortDir,
  signal,
} = {}) {
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  })

  if (search.trim()) {
    searchParams.set('search', search.trim())
  }

   if (sortBy) {
    searchParams.set('sortBy', sortBy)
  }

  if (sortDir) {
    searchParams.set('sortDir', sortDir)
  }

  const response = await fetch(`${API_ENDPOINTS.records}?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Nu am putut incarca inregistrarile.')
  }

  return normalizeRecordsResponse(payload, page, pageSize)
}

export async function fetchRecordById(recordId, signal) {
  const response = await fetch(`${API_ENDPOINTS.records}/${recordId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Nu am putut incarca inregistrarea.')
  }

  return normalizeRecord(payload)
}

function buildMutationOptions(method, payload, signal) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  }
}

function toRecordPayload(input) {
  return {
    content: input.content.trim(),
    categoryId: Number(input.categoryId),
    statusId: Number(input.statusId),
    ownerId: Number(input.ownerId),
    priorityId: Number(input.priorityId),
  }
}

export async function createRecord(input, signal) {
  const response = await fetch(
    API_ENDPOINTS.records,
    buildMutationOptions('POST', toRecordPayload(input), signal),
  )
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Nu am putut crea inregistrarea.')
  }

  return normalizeRecord(payload)
}

export async function updateRecord(recordId, input, signal) {
  const response = await fetch(
    `${API_ENDPOINTS.records}/${recordId}`,
    buildMutationOptions('PUT', toRecordPayload(input), signal),
  )
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Nu am putut actualiza inregistrarea.')
  }

  return normalizeRecord(payload)
}

export async function deleteRecord(recordId, signal) {
  const response = await fetch(`${API_ENDPOINTS.records}/${recordId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.message ?? 'Nu am putut sterge inregistrarea.')
  }
}

export async function generateLoremRecords(count, signal) {
  const response = await fetch(`${API_ENDPOINTS.records}/generate-lorem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ count }),
    signal,
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Nu am putut genera inregistrarile lorem.')
  }

  return payload
}

export { ALL_PAGE_SIZE, DEFAULT_PAGE_SIZE }
