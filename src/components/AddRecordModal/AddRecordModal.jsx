import { useState } from 'react'
import ModalShell from '../ModalShell/ModalShell.jsx'
import RecordForm from '../RecordForm/RecordForm.jsx'
import { getInitialForm, validateForm } from '../RecordForm/recordFormUtils.js'
import './AddRecordModal.css'

function AddRecordModal({
  open,
  lookups,
  lookupsLoading,
  lookupsError,
  pending,
  serverError,
  onClose,
  onSubmit,
}) {
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

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="New Record"
      eyebrow="Draft entry - ready to persist"
      description="Completeaza datele si selecteaza owner, categorie, status si prioritate din backend."
      contentClassName="add-record-modal"
      footer={
        <div className="record-modal-actions">
          <button
            type="button"
            className="record-modal-button record-modal-button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-record-form"
            className="record-modal-button record-modal-button-primary"
            disabled={pending}
          >
            {pending ? 'Saving...' : 'Create Record'}
          </button>
        </div>
      }
    >
      <form id="add-record-form" className="record-modal-form" onSubmit={handleSubmit}>
        <RecordForm
          form={form}
          errors={errors}
          onChange={handleChange}
          lookups={lookups}
          lookupsLoading={lookupsLoading}
          lookupsError={lookupsError}
          serverError={serverError}
        />
      </form>
    </ModalShell>
  )
}

export default AddRecordModal
