import ModalShell from '../ModalShell/ModalShell.jsx'
import './DeleteRecordModal.css'

function DeleteRecordModal({ open, record, pending, serverError, onClose, onConfirm }) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Delete Record"
      size="sm"
      tone="destructive"
      eyebrow={record?.rawId ? `System ID: ${record.rawId}` : undefined}
      description="Aceasta actiune sterge definitiv inregistrarea din backend si nu poate fi anulata."
      contentClassName="delete-record-modal"
      footer={
        <div className="record-modal-actions">
          <button
            type="button"
            className="record-modal-button record-modal-button-secondary"
            onClick={onClose}
          >
            Keep Record
          </button>

          <button
            type="button"
            className="record-modal-button record-modal-button-destructive"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      }
    >
      <div className="delete-record-summary">
        <p className="delete-record-title">{record?.content ?? 'Unknown record'}</p>
        <p className="delete-record-meta">
          {[record?.category, record?.owner, record?.status].filter(Boolean).join(' · ')}
        </p>
      </div>

      {serverError ? (
        <p role="alert" className="delete-record-alert">
          {serverError}
        </p>
      ) : null}
    </ModalShell>
  )
}

export default DeleteRecordModal
