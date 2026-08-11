import GridRow from './GridRow.jsx'

function Grid({
  columns,
  rows,
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  isMobile,
  onEditRow,
  onDeleteRow,
  sortBy,
  sortDir,
}) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages
  const pageSizeOptions = ['10', '20', '50', 'all']

  const getSortLabel = (column) => {
    if (sortBy !== column.key) {
      return `${column.label} unsorted`
    }

    return `${column.label} sorted ${sortDir === 'asc' ? 'ascending' : 'descending'}`
  }

  return (
    <section className="table-grid-shell">
      <div className="table-grid">
        {!isMobile ? (
          <table className="table-grid-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      column.sortable
                        ? sortBy === column.key
                          ? sortDir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                        : undefined
                    }
                    className={`grid-header-cell grid-header-${column.key}`}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="grid-header-button"
                        onClick={() => onSortChange(column.key)}
                        aria-label={getSortLabel(column)}
                      >
                        <span>{column.label}</span>
                        <span className="grid-header-sort-indicator">
                          <span
                            className={`grid-header-sort-arrow ${
                              sortBy === column.key && sortDir === 'asc'
                                ? 'grid-header-sort-arrow-active'
                                : ''
                            }`.trim()}
                            aria-hidden="true"
                          >
                            ▲
                          </span>
                          <span
                            className={`grid-header-sort-arrow ${
                              sortBy === column.key && sortDir === 'desc'
                                ? 'grid-header-sort-arrow-active'
                                : ''
                            }`.trim()}
                            aria-hidden="true"
                          >
                            ▼
                          </span>
                        </span>
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <GridRow
                  key={row.id}
                  row={row}
                  columns={columns}
                  isMobile={false}
                  onEdit={onEditRow}
                  onDelete={onDeleteRow}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid-mobile-list">
            {rows.map((row) => (
              <GridRow
                key={row.id}
                row={row}
                columns={columns}
                isMobile
                onEdit={onEditRow}
                onDelete={onDeleteRow}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="grid-footer">
        <div className="grid-footer-meta">
          <p className="grid-footer-summary">
            Showing {startIndex}-{endIndex} of {totalRecords} records
          </p>

          <div className="grid-page-size" role="group" aria-label="Rows per page">
            <span className="grid-page-size-label">Rows</span>
            <div className="grid-page-size-buttons">
              {pageSizeOptions.map((option) => {
                const isActive = String(pageSize) === option

                return (
                  <button
                    key={option}
                    type="button"
                    className={`grid-page-size-button ${
                      isActive ? 'grid-page-size-button-active' : ''
                    }`.trim()}
                    onClick={() => onPageSizeChange(option)}
                    aria-pressed={isActive}
                  >
                    {option === 'all' ? 'All' : option}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid-pagination">
          <button
            type="button"
            className="grid-pagination-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
          >
            Previous
          </button>

          <span className="grid-pagination-status">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            className="grid-pagination-button grid-pagination-button-primary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  )
}

export default Grid
