import { STATUS_LABELS } from '../../constants/statuses.js';

export function RequestStatus({ status }) {
  return (
    <span className={`request-status request-status--${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
