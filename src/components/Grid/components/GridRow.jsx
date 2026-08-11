function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 20h4l10-10-4-4L4 16v4zm11-13l4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 7h14M9 7V5h6v2m-7 3v7m4-7v7m4-7v7M8 20h8a1 1 0 001-1V7H7v12a1 1 0 001 1z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function ActionsCell({ row, onEdit, onDelete }) {
  return (
    <div className="grid-actions">
      <button
        type="button"
        className="grid-action-button"
        aria-label={`Edit row ${row.id}`}
        onClick={() => onEdit(row)}
      >
        <EditIcon />
      </button>

      <button
        type="button"
        className="grid-action-button"
        aria-label={`Delete row ${row.id}`}
        onClick={() => onDelete(row)}
      >
        <DeleteIcon />
      </button>
    </div>
  )
}

function GridRow({
  row,
  columns,
  isMobile,
  onEdit,
  onDelete,
}) {
  if (isMobile) {
    return (
      <article className="grid-mobile-card">
        <div className="grid-mobile-header">
          {columns[0].render(row)}

          <ActionsCell
            row={row}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>

        <div className="grid-mobile-primary">
          {columns[1].render(row)}
        </div>

        <div className="grid-mobile-meta">
          {columns.slice(2, -1).map((column) => (
            <div
              key={column.key}
              className="grid-mobile-meta-item"
            >
              <span className="grid-mobile-meta-label">
                {column.label}
              </span>

              <div className="grid-mobile-meta-value">
                {column.render(row)}
              </div>
            </div>
          ))}
        </div>
      </article>
    )
  }

  return (
    <tr className="grid-row">
      {columns.slice(0, -1).map((column) => (
        <td
          key={column.key}
          className={`grid-cell grid-cell-${column.key}`}
        >
          {column.render(row)}
        </td>
      ))}

      <td className="grid-cell grid-cell-actions">
        <ActionsCell
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  )
}

export default GridRow