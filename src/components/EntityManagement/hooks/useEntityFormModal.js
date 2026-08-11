import { useState } from 'react'
import {
  normalizeValue,
  validateEntityName,
} from '../utils/entityFormUtils.js'

function useEntityFormModal({
  mode,
  entityLabel,
  initialValue,
  onSubmit,
}) {
  const normalizedInitialValue = normalizeValue(initialValue)

  const [name, setName] = useState(normalizedInitialValue)
  const [error, setError] = useState('')

  const hasChanges =
    normalizeValue(name) !== normalizedInitialValue

  const handleNameChange = (event) => {
    setName(event.target.value)
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedName = normalizeValue(name)
    const validationError = validateEntityName(
      trimmedName,
      entityLabel,
    )

    if (validationError) {
      setError(validationError)
      return
    }

    if (mode === 'edit' && !hasChanges) {
      setError('Nu ai modificat nimic.')
      return
    }

    onSubmit(trimmedName)
  }

  return {
    name,
    error,
    hasChanges,
    handleNameChange,
    handleSubmit,
  }
}

export default useEntityFormModal