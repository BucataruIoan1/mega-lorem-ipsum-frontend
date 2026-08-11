const TABLE_COLUMNS = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    sortValue: (row) => row.rawId ?? 0,
    render: (row) => (
      <span className="grid-id">
        {row.id}
      </span>
    ),
  },
  {
    key: 'content',
    label: 'Content Segment',
    sortable: true,
    sortValue: (row) => row.content,
    render: (row) => (
      <div className="grid-content">
        <span className="grid-content-title">
          {row.content}
        </span>

        {row.description ? (
          <span className="grid-content-description">
            {row.description}
          </span>
        ) : null}
      </div>
    ),
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    sortValue: (row) => row.category,
    render: (row) => (
      <span className="grid-category">
        {row.category}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    sortValue: (row) => row.status,
    render: (row) => {
      const normalizedStatus = String(row.status)
        .trim()
        .toLowerCase()

      const statusClassName =
        normalizedStatus === 'inactive'
          ? 'grid-badge-status-inactive'
          : 'grid-badge-status-active'

      return (
        <span
          className={`grid-badge grid-badge-status ${statusClassName}`}
        >
          <span
            className="grid-badge-dot"
            aria-hidden="true"
          />

          {row.status}
        </span>
      )
    },
  },
  {
    key: 'owner',
    label: 'Owner',
    sortable: true,
    sortValue: (row) => row.owner,
    render: (row) => {
      const [firstName, ...lastNameParts] = String(
        row.owner ?? '',
      ).split(' ')

      return (
        <span className="grid-owner">
          <span>{firstName}</span>
          <span>{lastNameParts.join(' ')}</span>
        </span>
      )
    },
  },
  {
    key: 'priority',
    label: 'Priority',
    sortable: true,
    sortValue: (row) => row.priority,
    render: (row) => {
      const priorityClassName = String(row.priority)
        .toLowerCase()
        .replace(/\s+/g, '-')

      return (
        <span
          className={`grid-badge grid-badge-priority-${priorityClassName}`}
        >
          {row.priority}
        </span>
      )
    },
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
    sortable: true,
    sortValue: (row) => row.lastModified,
    render: (row) => (
      <span className="grid-last-modified">
        {row.lastModified}
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    render: () => null,
  },
]

export default TABLE_COLUMNS