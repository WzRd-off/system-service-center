import { RequestCard } from './RequestCard.jsx';

export function RequestList({ requests = [], basePath = '/requests' }) {
  if (!requests.length) return <p>Заявок немає</p>;
  return (
    <div className="request-list">
      {requests.map((r) => <RequestCard key={r.id} request={r} basePath={basePath} />)}
    </div>
  );
}
