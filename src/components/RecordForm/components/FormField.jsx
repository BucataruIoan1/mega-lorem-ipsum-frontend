function FormField({
  label,
  htmlFor,
  required,
  error,
  children,
}) {
  return (
    <div className="record-form-field">
      <label
        className="record-form-label"
        htmlFor={htmlFor}
      >
        {label}

        {required ? (
          <span className="record-form-required">*</span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="record-form-error"
        >
          <span
            className="record-form-error-dot"
            aria-hidden="true"
          />

          {error}
        </p>
      ) : null}
    </div>
  )
}

export default FormField