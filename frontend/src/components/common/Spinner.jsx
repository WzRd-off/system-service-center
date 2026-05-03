export function Spinner({ size = 'md', label = 'Завантаження...', fullscreen = false, inline = false }) {
  const spinner = (
    <span
      className={`spinner spinner-${size}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    />
  );

  if (inline) return spinner;

  if (fullscreen) {
    return (
      <div className="spinner-overlay">
        <div className="spinner-wrap">
          {spinner}
          {label && <span className="spinner-label">{label}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="spinner-wrap">
      {spinner}
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}
