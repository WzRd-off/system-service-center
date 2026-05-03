import { useId } from 'react';

export function Input({
  label,
  error,
  hint,
  required = false,
  type = 'text',
  className = '',
  id,
  ...props
}) {
  const reactId = useId();
  const inputId = id || reactId;
  const wrapperClass = ['input-field', error ? 'input-field--error' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className="input-control"
        {...props}
      />
      {error ? (
        <small id={`${inputId}-error`} className="error">{error}</small>
      ) : hint ? (
        <small id={`${inputId}-hint`} className="input-hint">{hint}</small>
      ) : null}
    </div>
  );
}
