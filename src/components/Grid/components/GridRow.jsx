import DeleteIcon from '../../Shared/DeleteIcon/DeleteIcon.tsx'
import EditIcon from '../../Shared/EditIcon/EditIcon.tsx'

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
