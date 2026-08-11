function normalizeFormValue(value) {
  return String(value ?? '').trim()
}

function areFormsEqual(currentForm, initialForm) {
  return (
    normalizeFormValue(currentForm.content) ===
      normalizeFormValue(initialForm.content) &&
    normalizeFormValue(currentForm.categoryId) ===
      normalizeFormValue(initialForm.categoryId) &&
    normalizeFormValue(currentForm.statusId) ===
      normalizeFormValue(initialForm.statusId) &&
    normalizeFormValue(currentForm.ownerId) ===
      normalizeFormValue(initialForm.ownerId) &&
    normalizeFormValue(currentForm.priorityId) ===
      normalizeFormValue(initialForm.priorityId)
  )
}

export {
  normalizeFormValue,
  areFormsEqual,
}