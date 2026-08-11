import GridRow from './GridRow.jsx'
import GridFooter from './GridFooter.jsx'
import useGrid from '../hooks/useGrid.js'
import { getSortLabel } from '../utils/gridUtils.js'

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
  const {
    canGoPrevious,
    canGoNext,
    handlePreviousPage,
    handleNextPage,
  } = useGrid({
    currentPage,
    totalPages,
    onPageChange,
  })

  return (
    <section className="grid">
      {!isMobile ? (
        <div className="grid-table-wrapper">
          <table className="grid-table">
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
                        aria-label={getSortLabel(
                          column,
                          sortBy,
                          sortDir,
                        )}
                      >
                        {column.label}

                        <span
                          className="grid-header-sort-indicator"
                          aria-hidden="true"
                        >
                          <span
                            className={`grid-header-sort-arrow grid-header-sort-arrow-up ${
                              sortBy === column.key && sortDir === 'asc'
                                ? 'grid-header-sort-arrow-active'
                                : ''
                            }`.trim()}
                          >
                            ▲
                          </span>

                          <span
                            className={`grid-header-sort-arrow grid-header-sort-arrow-down ${
                              sortBy === column.key && sortDir === 'desc'
                                ? 'grid-header-sort-arrow-active'
                                : ''
                            }`.trim()}
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
        </div>
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

      <GridFooter
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageSize={pageSize}
        startIndex={startIndex}
        endIndex={endIndex}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  )
}

export default Grid
