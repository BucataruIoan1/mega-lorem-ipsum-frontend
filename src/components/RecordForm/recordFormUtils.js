function findOptionIdByLabel(options, label) {
  const match = options.find(
    (option) => option.label.trim().toLowerCase() === String(label).trim().toLowerCase(),
  )

  return match ? String(match.id) : ''
}

function getInitialForm(record, lookups) {
  if (!record) {
    return {
      content: '',
      categoryId: '',
      statusId: '',
      ownerId: '',
      priorityId: '',
    }
  }

  return {
    content: record.content ?? '',
    categoryId:
      record.categoryId !== null && record.categoryId !== undefined
        ? String(record.categoryId)
        : findOptionIdByLabel(lookups.categories, record.category),
    statusId:
      record.statusId !== null && record.statusId !== undefined
        ? String(record.statusId)
        : findOptionIdByLabel(lookups.statuses, record.status),
    ownerId:
      record.ownerId !== null && record.ownerId !== undefined
        ? String(record.ownerId)
        : findOptionIdByLabel(lookups.owners, record.owner),
    priorityId:
      record.priorityId !== null && record.priorityId !== undefined
        ? String(record.priorityId)
        : findOptionIdByLabel(lookups.priorities, record.priority),
  }
}

function validateForm(form) {
  const errors = {}

  if (form.content.trim().length < 3) {
    errors.content = 'Continutul este obligatoriu si trebuie sa aiba cel putin 3 caractere.'
  }

  if (!form.categoryId) {
    errors.categoryId = 'Selecteaza o categorie.'
  }

  if (!form.statusId) {
    errors.statusId = 'Selecteaza un status.'
  }

  if (!form.ownerId) {
    errors.ownerId = 'Selecteaza un owner.'
  }

  if (!form.priorityId) {
    errors.priorityId = 'Selecteaza o prioritate.'
  }

  return errors
}

export { getInitialForm, validateForm }
