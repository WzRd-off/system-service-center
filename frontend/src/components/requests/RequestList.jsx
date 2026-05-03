import { RequestCard } from './RequestCard.jsx';

export function RequestList({ requests, basePath = '/requests' }) {
  const items = Array.isArray(requests) ? requests : [];
  if (!items.length) return <p>Заявок немає</p>;
  return (
    <div className="request-list">
      {items.map((r) => <RequestCard key={r.id} request={r} basePath={basePath} />)}
    </div>
  );
}
