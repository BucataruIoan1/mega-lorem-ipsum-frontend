import { useMemo, useState } from 'react'
import {
  getInitialForm,
  validateForm,
} from '../../RecordForm/utils/recordFormUtils.js'
import { areFormsEqual } from '../utils/editRecordModalUtils.js'

function useEditRecordModal(record, lookups, onSubmit) {
  const initialForm = useMemo(
    () => getInitialForm(record, lookups),
    [record, lookups],
  )

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  const hasChanges = !areFormsEqual(form, initialForm)

  const handleChange = (key, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
    }))

    setFormError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateForm(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    if (!hasChanges) {
      setFormError('Nu ai modificat nimic.')
      return
    }

    onSubmit(form)
  }

  return {
    form,
    errors,
    formError,
    hasChanges,
    handleChange,
    handleSubmit,
  }
}

export default useEditRecordModal