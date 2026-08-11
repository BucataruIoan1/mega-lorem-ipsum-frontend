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

function getEntityName(item) {
  if (typeof item === 'string') {
    return item
  }

  return (
    item?.name ??
    item?.label ??
    item?.title ??
    item?.value ??
    (item?.id !== undefined ? String(item.id) : 'Unknown')
  )
}

function normalizeEntity(item) {
  return {
    id: item?.id ?? getEntityName(item),
    name: getEntityName(item),
  }
}

async function parseResponse(response, fallbackError) {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message ?? fallbackError)
  }

  return payload
}

function buildRequestOptions(method, payload, signal) {
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

export async function getEntities(url, fallbackError, signal) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  const payload = await parseResponse(response, fallbackError)

  return getCollection(payload).map(normalizeEntity)
}

export async function createEntity(url, name, fallbackError, signal) {
  const response = await fetch(
    url,
    buildRequestOptions(
      'POST',
      {
        name: name.trim(),
      },
      signal,
    ),
  )

  const payload = await parseResponse(response, fallbackError)

  return normalizeEntity(payload)
}

export async function updateEntity(
  url,
  entityId,
  name,
  fallbackError,
  signal,
) {
  const response = await fetch(
    `${url}/${entityId}`,
    buildRequestOptions(
      'PUT',
      {
        name: name.trim(),
      },
      signal,
    ),
  )

  const payload = await parseResponse(response, fallbackError)

  return normalizeEntity(payload)
}

export async function deleteEntity(
  url,
  entityId,
  fallbackError,
  signal,
) {
  const response = await fetch(`${url}/${entityId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)

    throw new Error(payload?.message ?? fallbackError)
  }
}