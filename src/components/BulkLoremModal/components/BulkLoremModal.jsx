import ModalShell from '../../ModalShell/components/ModalShell.jsx'
import useBulkLoremModal from '../hooks/useBulkLoremModal.js'
import './BulkLoremModal.css'

function BulkLoremModal({
  open,
  pending,
  serverError,
  onClose,
  onSubmit,
}) {
  const {
    selectedCount,
    formError,
    bulkOptions,
    handleCountChange,
    handleSubmit,
  } = useBulkLoremModal(onSubmit)

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add Lorem Bulk"
      eyebrow="Bulk generator"
      description="Genereaza rapid un set de inregistrari lorem."
      contentClassName="bulk-lorem-modal"
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
            form="bulk-lorem-form"
            className="record-modal-button record-modal-button-primary"
            disabled={pending}
          >
            {pending ? 'Generating...' : 'Generate Records'}
          </button>
        </div>
      }
    >
      <form
        id="bulk-lorem-form"
        className="bulk-lorem-form"
        onSubmit={handleSubmit}
      >
        <div
          className="bulk-lorem-grid"
          role="radiogroup"
          aria-label="Number of records"
        >
          {bulkOptions.map((count) => {
            const isActive = selectedCount === count

            return (
              <button
                key={count}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`bulk-lorem-option ${
                  isActive ? 'bulk-lorem-option-active' : ''
                }`.trim()}
                onClick={() => handleCountChange(count)}
                disabled={pending}
              >
                {count}
              </button>
            )
          })}
        </div>

        <p className="bulk-lorem-helper">
          Poți genera doar 10, 20, 50, 100 sau 200 de înregistrări dintr-un foc.
        </p>

        {formError || serverError ? (
          <p
            role="alert"
            className="record-form-alert record-form-alert-destructive"
          >
            {formError || serverError}
          </p>
        ) : null}
      </form>
    </ModalShell>
  )
}

export default BulkLoremModal