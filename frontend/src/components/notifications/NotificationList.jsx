import { formatDateTime } from '../../utils/formatters.js';

export function NotificationList({ items, onRead, onRemove }) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return <p>Сповіщень немає</p>;
  return (
    <ul className="notifications">
      {list.map((n) => (
        <li key={n.id} className={n.is_read ? 'read' : 'unread'}>
          <p>{n.message}</p>
          <small>{formatDateTime(n.created_at)}</small>
          <div className="actions">
            {!n.is_read && <button onClick={() => onRead?.(n.id)}>Прочитано</button>}
            <button onClick={() => onRemove?.(n.id)}>Видалити</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
