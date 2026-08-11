import { PAGE_SIZE_OPTIONS } from '../utils/gridUtils.js'

function GridFooter({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  startIndex,
  endIndex,
  canGoPrevious,
  canGoNext,
  onPreviousPage,
  onNextPage,
  onPageSizeChange,
}) {
  return (
    <footer className="grid-footer">
      <div className="grid-footer-meta">
        <p className="grid-footer-summary">
          Showing {startIndex}-{endIndex} of {totalRecords} records
        </p>

        <div
          className="grid-page-size"
          role="group"
          aria-label="Rows per page"
        >
          <span className="grid-page-size-label">Rows</span>

          <div className="grid-page-size-buttons">
            {PAGE_SIZE_OPTIONS.map((option) => {
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
          onClick={onPreviousPage}
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
          onClick={onNextPage}
          disabled={!canGoNext}
        >
          Next
        </button>
      </div>
    </footer>
  )
}

export default GridFooter