const normalizedBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export const API_ENDPOINTS = {
  records: normalizedBaseUrl ? `${normalizedBaseUrl}/api/records` : '/api/records',
  categories: normalizedBaseUrl ? `${normalizedBaseUrl}/api/categories` : '/api/categories',
  statuses: normalizedBaseUrl ? `${normalizedBaseUrl}/api/statuses` : '/api/statuses',
  priorities: normalizedBaseUrl ? `${normalizedBaseUrl}/api/priorities` : '/api/priorities',
  owners: normalizedBaseUrl ? `${normalizedBaseUrl}/api/owners` : '/api/owners',
}
