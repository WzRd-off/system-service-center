import { useId } from 'react';

export function Select({
  label,
  options = [],
  error,
  hint,
  required = false,
  placeholder,
  className = '',
  id,
  ...props
}) {
  const reactId = useId();
  const selectId = id || reactId;
  const wrapperClass = ['input-field', error ? 'input-field--error' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={selectId} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        className="input-control"
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <small id={`${selectId}-error`} className="error">{error}</small>
      ) : hint ? (
        <small id={`${selectId}-hint`} className="input-hint">{hint}</small>
      ) : null}
    </div>
  );
}
