import { API_ENDPOINTS } from './apiEndpoints.js'

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

  if (Array.isArray(payload.data)) {
    return payload.data
  }

  if (Array.isArray(payload.results)) {
    return payload.results
  }

  return []
}

function getLookupLabel(item) {
  if (typeof item === 'string') {
    return item
  }

  return (
    item?.name ??
    item?.label ??
    item?.title ??
    item?.value ??
    item?.content ??
    (item?.id !== undefined ? String(item.id) : 'Unknown')
  )
}

function normalizeLookupItem(item) {
  if (typeof item === 'string') {
    return {
      id: item,
      label: item,
    }
  }

  return {
    id: item?.id ?? getLookupLabel(item),
    label: getLookupLabel(item),
  }
}

async function fetchLookupCollection(url, errorMessage, signal) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message ?? errorMessage)
  }

  return getCollection(payload).map(normalizeLookupItem)
}

export async function fetchRecordLookups(signal) {
  const [categories, statuses, priorities, owners] = await Promise.all([
    fetchLookupCollection(
      API_ENDPOINTS.categories,
      'Nu am putut incarca categoriile.',
      signal,
    ),
    fetchLookupCollection(
      API_ENDPOINTS.statuses,
      'Nu am putut incarca statusurile.',
      signal,
    ),
    fetchLookupCollection(
      API_ENDPOINTS.priorities,
      'Nu am putut incarca prioritatile.',
      signal,
    ),
    fetchLookupCollection(API_ENDPOINTS.owners, 'Nu am putut incarca ownerii.', signal),
  ])

  return {
    categories,
    statuses,
    priorities,
    owners,
  }
}
