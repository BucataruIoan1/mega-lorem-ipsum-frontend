export function normalizeValue(value) {
  return String(value ?? '').trim()
}

export function validateEntityName(name, entityLabel) {
  const normalizedName = normalizeValue(name)

  if (normalizedName.length < 2) {
    return `Numele pentru ${entityLabel.toLowerCase()} trebuie sa aiba cel putin 2 caractere.`
  }

  return ''
}