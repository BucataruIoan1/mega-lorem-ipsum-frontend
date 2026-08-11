import { useState } from 'react'
import {
  getInitialForm,
  validateForm,
} from '../../RecordForm/utils/recordFormUtils.js'

function useAddRecordModal(lookups, onSubmit) {
  const [form, setForm] = useState(() => getInitialForm(null, lookups))
  const [errors, setErrors] = useState({})

  const handleChange = (key, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateForm(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit(form)
  }

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
  }
}

export default useAddRecordModal