import ModalShell from '../../ModalShell/components/ModalShell.jsx'
import RecordForm from '../../RecordForm/components/RecordForm.jsx'
import useEditRecordModal from '../hooks/useEditRecordModal.js'
import './EditRecordModal.css'

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
  const {
    form,
    errors,
    formError,
    hasChanges,
    handleChange,
    handleSubmit,
  } = useEditRecordModal(record, lookups, onSubmit)

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Edit Record"
      eyebrow={record?.rawId ? `System ID: ${record.rawId}` : undefined}
      description="Actualizeaza continutul si alege noile valori din liste."
      contentClassName="edit-record-modal"
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
            form="edit-record-form"
            className="record-modal-button record-modal-button-primary"
            disabled={pending || !hasChanges}
          >
            {pending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      }
    >
      <form
        id="edit-record-form"
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
          serverError={serverError || formError}
        />
      </form>
    </ModalShell>
  )
}

export default EditRecordModal