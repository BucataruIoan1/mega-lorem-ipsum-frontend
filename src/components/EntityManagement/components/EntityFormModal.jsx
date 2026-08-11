import ModalShell from '../../ModalShell/components/ModalShell.jsx'
import useEntityFormModal from '../hooks/useEntityFormModal.js'
import '../../RecordForm/components/RecordForm.css'
import '../../AddRecordModal/components/AddRecordModal.css'

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
  const {
    name,
    error,
    hasChanges,
    handleNameChange,
    handleSubmit,
  } = useEntityFormModal({
    mode,
    entityLabel,
    initialValue,
    onSubmit,
  })

  const formId = `${mode}-${entityLabel.toLowerCase()}-form`
  const inputId = `${entityLabel.toLowerCase()}-name`

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
            className="record-modal-button"
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </button>

          <button
            type="submit"
            form={formId}
            className="record-modal-button record-modal-button-primary"
            disabled={pending || (mode === 'edit' && !hasChanges)}
          >
            {pending ? 'Saving...' : 'Save'}
          </button>
        </div>
      }
    >
      <form
        id={formId}
        className="entity-form"
        onSubmit={handleSubmit}
      >
        <div className="record-form-field">
          <label
            className="record-form-label"
            htmlFor={inputId}
          >
            {entityLabel} Name
            <span className="record-form-required">*</span>
          </label>

          <input
            id={inputId}
            type="text"
            className="record-form-input"
            value={name}
            onChange={handleNameChange}
            placeholder={placeholder}
            aria-invalid={
              error || serverError ? 'true' : undefined
            }
          />

          {error || serverError ? (
            <p
              role="alert"
              className="record-form-alert record-form-alert-destructive"
            >
              {error || serverError}
            </p>
          ) : null}
        </div>
      </form>
    </ModalShell>
  )
}

export default EntityFormModal