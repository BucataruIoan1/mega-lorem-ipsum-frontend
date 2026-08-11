import { useState } from 'react'
import ModalShell from '../ModalShell/ModalShell.jsx'
import '../RecordForm/RecordForm.css'
import '../AddRecordModal/AddRecordModal.css'

function normalizeValue(value) {
  return String(value ?? '').trim()
}

function EntityFormModal({
  open,
  mode,
  entityLabel,
  pending,
  serverError,
  initialValue = '',
  placeholder,
  description,
  onClose,
  onSubmit,
}) {
  const normalizedInitialValue = normalizeValue(initialValue)
  const [name, setName] = useState(normalizedInitialValue)
  const [error, setError] = useState('')
  const hasChanges = normalizeValue(name) !== normalizedInitialValue

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedName = normalizeValue(name)

    if (trimmedName.length < 2) {
      setError(`Numele pentru ${entityLabel.toLowerCase()} trebuie sa aiba cel putin 2 caractere.`)
      return
    }

    if (mode === 'edit' && !hasChanges) {
      setError('Nu ai modificat nimic.')
      return
    }

    onSubmit(trimmedName)
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? `Edit ${entityLabel}` : `New ${entityLabel}`}
      description={description}
      contentClassName="entity-form-modal"
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
            form={`${mode}-${entityLabel.toLowerCase()}-form`}
            className="record-modal-button record-modal-button-primary"
            disabled={pending || (mode === 'edit' && !hasChanges)}
          >
            {pending ? 'Saving...' : 'Save'}
          </button>
        </div>
      }
    >
      <form
        id={`${mode}-${entityLabel.toLowerCase()}-form`}
        className="entity-form"
        onSubmit={handleSubmit}
      >
        <div className="record-form-field">
          <label className="record-form-label" htmlFor={`${entityLabel.toLowerCase()}-name`}>
            {entityLabel} Name
            <span className="record-form-required">*</span>
          </label>

          <input
            id={`${entityLabel.toLowerCase()}-name`}
            type="text"
            className="record-form-input"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError('')
            }}
            placeholder={placeholder}
            aria-invalid={error || serverError ? 'true' : undefined}
          />

          {error || serverError ? (
            <p role="alert" className="record-form-alert record-form-alert-destructive">
              {error || serverError}
            </p>
          ) : null}
        </div>
      </form>
    </ModalShell>
  )
}

export default EntityFormModal
