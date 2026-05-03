import { Select } from '../common/Select.jsx';
import { STATUS_LABELS } from '../../constants/statuses.js';

const statusOptions = [
  { value: '', label: 'Усі статуси' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))
];

export function RequestFilters({ filters, onChange }) {
  return (
    <div className="request-filters">
      <Select
        label="Статус"
        value={filters.status || ''}
        options={statusOptions}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      />
    </div>
  );
}
