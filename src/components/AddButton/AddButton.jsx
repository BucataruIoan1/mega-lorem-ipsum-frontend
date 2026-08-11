function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  )
}

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
