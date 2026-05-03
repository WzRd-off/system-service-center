export function Select({ label, options = [], error, ...props }) {
  return (
    <label className="input-field">
      {label && <span>{label}</span>}
      <select {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <small className="error">{error}</small>}
    </label>
  );
}
