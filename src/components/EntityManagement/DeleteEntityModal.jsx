import ModalShell from '../ModalShell/ModalShell.jsx'
import '../AddRecordModal/AddRecordModal.css'
import '../DeleteRecordModal/DeleteRecordModal.css'

function DeleteEntityModal({
  open,
  entityLabel,
  item,
  pending,
  serverError,
  onClose,
  onConfirm,
}) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`Delete ${entityLabel}`}
      size="sm"
      tone="destructive"
      description="This permanently removes the entry. Existing records keep their current value."
      contentClassName="delete-record-modal"
      footer={
        <div className="record-modal-actions">
          <button
            type="button"
            className="record-modal-button record-modal-button-secondary"
            onClick={onClose}
          >
            Keep it
          </button>

          <button
            type="button"
            className="record-modal-button record-modal-button-destructive"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? 'Deleting...' : 'Delete permanently'}
          </button>
        </div>
      }
    >
      <div className="delete-record-summary">
        <p className="delete-record-title">{item?.name ?? `Unknown ${entityLabel}`}</p>
      </div>

      {serverError ? (
        <p role="alert" className="delete-record-alert">
          {serverError}
        </p>
      ) : null}
    </ModalShell>
  )
}

export default DeleteEntityModal
