import { STATUS_LABELS, STATUS_COLORS } from '../../constants/statuses.js';

export function RequestStatus({ status }) {
  return (
    <span className="request-status" style={{ background: STATUS_COLORS[status], color: '#fff' }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
