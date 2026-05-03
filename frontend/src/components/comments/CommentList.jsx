import { formatDateTime } from '../../utils/formatters.js';

export function CommentList({ comments }) {
  const items = Array.isArray(comments) ? comments : [];
  if (!items.length) return <p>Коментарів поки немає</p>;
  return (
    <ul className="comment-list">
      {items.map((c) => (
        <li key={c.id} className="comment">
          <header>
            <strong>{c.author_role}</strong>
            <small>{formatDateTime(c.created_at)}</small>
          </header>
          <p>{c.text}</p>
        </li>
      ))}
    </ul>
  );
}
