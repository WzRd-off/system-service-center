import { Link } from 'react-router-dom';
import { RequestStatus } from './RequestStatus.jsx';
import { formatDate } from '../../utils/formatters.js';

export function RequestCard({ request, basePath }) {
  return (
    <Link to={`${basePath}/${request.id}`} className="request-card">
      <div className="request-card__header">
        <span className="request-card__number">№ {request.request_number}</span>
        <RequestStatus status={request.status} />
      </div>
      <p className="request-card__description">{request.description}</p>
      <small>{formatDate(request.created_at)}</small>
    </Link>
  );
}
