import PlusIcon from '../Shared/PlusIcon/PlusIcon.tsx'

function AddButton({ onClick }) {
  return (
    <button type="button" className="table-add-button" onClick={onClick}>
      <span className="table-add-icon">
        <PlusIcon />
      </span>
      New Entry
    </button>
  )
}

export default AddButton
