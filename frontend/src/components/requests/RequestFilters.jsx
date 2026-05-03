import { Select } from '../common/Select.jsx';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';
import { STATUS_LABELS } from '../../constants/statuses.js';

const statusOptions = [
  { value: '', label: 'Усі статуси' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export function RequestFilters({ filters, onChange, technicians = [] }) {
  const technicianOptions = [
    { value: '', label: 'Усі майстри' },
    ...technicians.map((t) => ({
      value: String(t.id),
      label: `${t.first_name || ''} ${t.last_name || ''}`.trim() || t.email,
    })),
  ];

  const update = (patch) => onChange({ ...filters, ...patch });

  const reset = () =>
    onChange({ status: '', dateFrom: '', dateTo: '', client: '', technicianId: '' });

  return (
    <div className="request-filters">
      <Select
        label="Статус"
        value={filters.status || ''}
        options={statusOptions}
        onChange={(e) => update({ status: e.target.value })}
      />
      <Input
        label="Дата з"
        type="date"
        value={filters.dateFrom || ''}
        onChange={(e) => update({ dateFrom: e.target.value })}
      />
      <Input
        label="Дата по"
        type="date"
        value={filters.dateTo || ''}
        onChange={(e) => update({ dateTo: e.target.value })}
      />
      <Input
        label="Клієнт"
        placeholder="Ім'я, email або телефон"
        value={filters.client || ''}
        onChange={(e) => update({ client: e.target.value })}
      />
      <Select
        label="Майстер"
        value={filters.technicianId || ''}
        options={technicianOptions}
        onChange={(e) => update({ technicianId: e.target.value })}
      />
      <Button type="button" variant="ghost" size="sm" onClick={reset}>
        Скинути фільтри
      </Button>
    </div>
  );
}
