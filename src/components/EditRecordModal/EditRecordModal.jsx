import { useMemo, useState } from 'react'
import ModalShell from '../ModalShell/ModalShell.jsx'
import RecordForm from '../RecordForm/RecordForm.jsx'
import { getInitialForm, validateForm } from '../RecordForm/recordFormUtils.js'
import './EditRecordModal.css'

function normalizeFormValue(value) {
  return String(value ?? '').trim()
}

function areFormsEqual(currentForm, initialForm) {
  return (
    normalizeFormValue(currentForm.content) === normalizeFormValue(initialForm.content) &&
    normalizeFormValue(currentForm.categoryId) === normalizeFormValue(initialForm.categoryId) &&
    normalizeFormValue(currentForm.statusId) === normalizeFormValue(initialForm.statusId) &&
    normalizeFormValue(currentForm.ownerId) === normalizeFormValue(initialForm.ownerId) &&
    normalizeFormValue(currentForm.priorityId) === normalizeFormValue(initialForm.priorityId)
  )
}

function EditRecordModal({
  open,
  record,
  lookups,
  lookupsLoading,
  lookupsError,
  pending,
  serverError,
  onClose,
  onSubmit,
}) {
  const initialForm = useMemo(() => getInitialForm(record, lookups), [record, lookups])
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

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Edit Record"
      eyebrow={record?.rawId ? `System ID: ${record.rawId}` : undefined}
      description="Actualizeaza continutul si alege noile valori din listele incarcate din backend."
      contentClassName="edit-record-modal"
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
            form="edit-record-form"
            className="record-modal-button record-modal-button-primary"
            disabled={pending || !hasChanges}
          >
            {pending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      }
    >
      <form id="edit-record-form" className="record-modal-form" onSubmit={handleSubmit}>
        <RecordForm
          form={form}
          errors={errors}
          onChange={handleChange}
          lookups={lookups}
          lookupsLoading={lookupsLoading}
          lookupsError={lookupsError}
          serverError={serverError || formError}
        />
      </form>
    </ModalShell>
  )
}

export default EditRecordModal
