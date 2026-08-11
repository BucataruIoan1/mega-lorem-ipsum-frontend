import './RecordForm.css'

function getOptionId(option) {
  return option ? String(option.id) : ''
}

function FormField({ label, htmlFor, required, error, children }) {
  return (
    <div className="record-form-field">
      <label className="record-form-label" htmlFor={htmlFor}>
        {label}
        {required ? <span className="record-form-required">*</span> : null}
      </label>

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="record-form-error">
          <span className="record-form-error-dot" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

function RecordForm({
  form,
  errors,
  onChange,
  lookups,
  lookupsLoading,
  lookupsError,
  serverError,
}) {
  return (
    <div className="record-form">
      <FormField
        label="Content"
        htmlFor="record-content"
        required
        error={errors.content}
      >
        <textarea
          id="record-content"
          className="record-form-input record-form-textarea"
          rows={4}
          value={form.content}
          onChange={(event) => onChange('content', event.target.value)}
          aria-invalid={errors.content ? 'true' : undefined}
          aria-describedby={errors.content ? 'record-content-error' : undefined}
          placeholder="Scrie continutul inregistrarii..."
        />
      </FormField>

      <div className="record-form-grid">
        <FormField
          label="Category"
          htmlFor="record-category"
          required
          error={errors.categoryId}
        >
          <select
            id="record-category"
            className="record-form-input"
            value={form.categoryId}
            onChange={(event) => onChange('categoryId', event.target.value)}
            disabled={lookupsLoading || lookups.categories.length === 0}
            aria-invalid={errors.categoryId ? 'true' : undefined}
            aria-describedby={errors.categoryId ? 'record-category-error' : undefined}
          >
            <option value="">
              {lookupsLoading ? 'Se incarca...' : 'Selecteaza categoria'}
            </option>
            {lookups.categories.map((category) => (
              <option key={category.id} value={getOptionId(category)}>
                {category.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Status"
          htmlFor="record-status"
          required
          error={errors.statusId}
        >
          <select
            id="record-status"
            className="record-form-input"
            value={form.statusId}
            onChange={(event) => onChange('statusId', event.target.value)}
            disabled={lookupsLoading || lookups.statuses.length === 0}
            aria-invalid={errors.statusId ? 'true' : undefined}
            aria-describedby={errors.statusId ? 'record-status-error' : undefined}
          >
            <option value="">
              {lookupsLoading ? 'Se incarca...' : 'Selecteaza statusul'}
            </option>
            {lookups.statuses.map((status) => (
              <option key={status.id} value={getOptionId(status)}>
                {status.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="record-form-grid">
        <FormField label="Owner" htmlFor="record-owner" required error={errors.ownerId}>
          <select
            id="record-owner"
            className="record-form-input"
            value={form.ownerId}
            onChange={(event) => onChange('ownerId', event.target.value)}
            disabled={lookupsLoading || lookups.owners.length === 0}
            aria-invalid={errors.ownerId ? 'true' : undefined}
            aria-describedby={errors.ownerId ? 'record-owner-error' : undefined}
          >
            <option value="">
              {lookupsLoading ? 'Se incarca...' : 'Selecteaza ownerul'}
            </option>
            {lookups.owners.map((owner) => (
              <option key={owner.id} value={getOptionId(owner)}>
                {owner.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Priority"
          htmlFor="record-priority"
          required
          error={errors.priorityId}
        >
          <div
            id="record-priority"
            className="record-form-priority"
            role="group"
            aria-label="Priority"
          >
            {lookups.priorities.map((priority) => {
              const value = getOptionId(priority)
              const isActive = form.priorityId === value

              return (
                <button
                  key={priority.id}
                  type="button"
                  className={`record-form-priority-option ${
                    isActive ? 'record-form-priority-option-active' : ''
                  }`.trim()}
                  onClick={() => onChange('priorityId', value)}
                  disabled={lookupsLoading}
                  aria-pressed={isActive}
                >
                  {priority.label}
                </button>
              )
            })}
          </div>
        </FormField>
      </div>

      {lookupsError ? (
        <p role="alert" className="record-form-alert">
          {lookupsError}
        </p>
      ) : null}

      {serverError ? (
        <p role="alert" className="record-form-alert record-form-alert-destructive">
          {serverError}
        </p>
      ) : null}
    </div>
  )
}

export default RecordForm
