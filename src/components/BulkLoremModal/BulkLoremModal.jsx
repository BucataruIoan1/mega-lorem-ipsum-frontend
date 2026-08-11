import { useState } from 'react'
import ModalShell from '../ModalShell/ModalShell.jsx'
import './BulkLoremModal.css'

const BULK_OPTIONS = [10, 20, 50, 100, 200]

function BulkLoremModal({ open, pending, serverError, onClose, onSubmit }) {
  const [selectedCount, setSelectedCount] = useState(20)
  const [formError, setFormError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!BULK_OPTIONS.includes(selectedCount)) {
      setFormError('Alege una dintre valorile permise: 10, 20, 50, 100 sau 200.')
      return
    }

    onSubmit(selectedCount)
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add Lorem Bulk"
      eyebrow="Bulk generator"
      description="Genereaza rapid un set de inregistrari lorem folosind optiunile permise de backend."
      contentClassName="bulk-lorem-modal"
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
            form="bulk-lorem-form"
            className="record-modal-button record-modal-button-primary"
            disabled={pending}
          >
            {pending ? 'Generating...' : 'Generate Records'}
          </button>
        </div>
      }
    >
      <form id="bulk-lorem-form" className="bulk-lorem-form" onSubmit={handleSubmit}>
        <div className="bulk-lorem-grid" role="radiogroup" aria-label="Number of records">
          {BULK_OPTIONS.map((count) => {
            const isActive = selectedCount === count

            return (
              <button
                key={count}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`bulk-lorem-option ${isActive ? 'bulk-lorem-option-active' : ''}`.trim()}
                onClick={() => {
                  setSelectedCount(count)
                  setFormError('')
                }}
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
          <p role="alert" className="record-form-alert record-form-alert-destructive">
            {formError || serverError}
          </p>
        ) : null}
      </form>
    </ModalShell>
  )
}

export default BulkLoremModal
