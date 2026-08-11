function HeaderTable({ navigation = null }) {
  return (
    <div className="table-header">
      <span className="table-live-badge">
        <span className="table-live-dot" aria-hidden="true" />
        Live Database
      </span>

      <div className="table-heading-block">
        <h1 className="table-title">
          Mega Lorem <span>Ipsum</span>
        </h1>
        <p className="table-subtitle">
          Real-time record management with deep-linking state synchronization.
        </p>
      </div>

      {navigation}
    </div>
  )
}

export default HeaderTable
