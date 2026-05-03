export function ErrorMessage({ error, fallback = 'Не вдалось завантажити дані' }) {
  if (!error) return null;
  const message = typeof error === 'string'
    ? error
    : error?.message || fallback;
  return <p className="error-block">{message}</p>;
}
