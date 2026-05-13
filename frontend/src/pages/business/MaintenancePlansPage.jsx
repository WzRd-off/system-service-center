import { useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Select } from '../../components/common/Select.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';
import { formatDate } from '../../utils/formatters.js';
import { sanitizeLongText } from '../../utils/validators.js';

const TYPE_OPTIONS = [
  { value: 'planned', label: 'Планове' },
  { value: 'preventive', label: 'Профілактичне' },
  { value: 'emergency', label: 'Аварійне' },
];

const INITIAL = { scheduleDate: '', type: 'planned', deviceId: '', notes: '' };

export function MaintenancePlansPage() {
  const plans = useFetch(() => businessClientsApi.getMaintenancePlans());
  const devices = useFetch(() => businessClientsApi.getDevices());
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'notes' ? sanitizeLongText(value) : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await businessClientsApi.createMaintenancePlan({
        ...form,
        deviceId: form.deviceId ? Number(form.deviceId) : null,
      });
      setForm(INITIAL);
      plans.reload();
    } finally {
      setSaving(false);
    }
  };

  const deviceOptions = [
    { value: '', label: '— уся техніка —' },
    ...(devices.data || []).map((d) => ({
      value: String(d.id),
      label: `${d.type} ${d.manufacturer || ''} ${d.model || ''}`.trim(),
    })),
  ];

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2>Планове обслуговування</h2>
        </section>

        <section className="canvas-card">
          <h3>Створити план</h3>
          <form onSubmit={submit} className="section-stack">
          <Input
            label="Дата обслуговування"
            type="date"
            name="scheduleDate"
            required
            value={form.scheduleDate}
            onChange={change}
          />
          <Select
            label="Тип"
            name="type"
            value={form.type}
            options={TYPE_OPTIONS}
            onChange={change}
          />
          <Select
            label="Техніка"
            name="deviceId"
            value={form.deviceId}
            options={deviceOptions}
            onChange={change}
          />
          <Input
            label="Примітки"
            name="notes"
            value={form.notes}
            onChange={change}
          />
            <Button type="submit" loading={saving}>Створити план</Button>
          </form>
        </section>

        <section className="canvas-card">
          <h3>Список планів</h3>
          {plans.loading ? (
            <Spinner />
          ) : plans.error ? (
            <ErrorMessage error={plans.error} />
          ) : !plans.data?.length ? (
            <p>Планів немає</p>
          ) : (
            <ul className="maintenance-plans">
              {plans.data.map((p) => (
                <li key={p.id}>
                  <strong>{formatDate(p.schedule_date)}</strong> — {p.type}
                  {p.device_model && <span> ({p.device_type} {p.device_model})</span>}
                  {p.notes && <p>{p.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
