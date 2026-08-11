function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  )
}

function FilterButton({ value, onChange }) {
  return (
    <label className="table-filter field">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Filter records..."
        aria-label="Filter table records"
      />
      <span className="table-filter-icon">
        <SearchIcon />
      </span>
    </label>
  )
}

export default FilterButton
