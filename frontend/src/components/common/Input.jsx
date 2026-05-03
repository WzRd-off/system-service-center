export function Input({ label, error, ...props }) {
  return (
    <label className="input-field">
      {label && <span>{label}</span>}
      <input {...props} />
      {error && <small className="error">{error}</small>}
    </label>
  );
}
