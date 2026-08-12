import SearchIcon from '../Shared/SearchIcon/SearchIcon.tsx'

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
