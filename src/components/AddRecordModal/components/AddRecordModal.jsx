import ModalShell from '../../ModalShell/components/ModalShell.jsx'
import RecordForm from '../../RecordForm/components/RecordForm.jsx'
import useAddRecordModal from '../hooks/useAddRecordModal.js'
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
  const {
    form,
    errors,
    handleChange,
    handleSubmit,
  } = useAddRecordModal(lookups, onSubmit)

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
            className="record-modal-button"
            onClick={onClose}
            disabled={pending}
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
      <form
        id="add-record-form"
        className="record-modal-form"
        onSubmit={handleSubmit}
      >
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