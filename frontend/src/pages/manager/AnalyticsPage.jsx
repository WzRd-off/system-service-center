import { useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { reportsApi } from '../../api/reports.api.js';
import { STATUS_LABELS } from '../../constants/statuses.js';

function Section({ title, query, children }) {
  return (
    <section className="canvas-card">
      <h3>{title}</h3>
      {query.loading ? (
        <Spinner />
      ) : query.error ? (
        <ErrorMessage error={query.error} />
      ) : !Array.isArray(query.data) || !query.data.length ? (
        <p>Даних немає</p>
      ) : (
        children(query.data)
      )}
    </section>
  );
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState({ dateFrom: '', dateTo: '' });
  const periodArg = {
    ...(period.dateFrom ? { dateFrom: period.dateFrom } : {}),
    ...(period.dateTo ? { dateTo: period.dateTo } : {}),
  };

  const byStatus = useFetch(() => reportsApi.requestsByStatus(periodArg), [
    period.dateFrom,
    period.dateTo,
  ]);
  const technicians = useFetch(() => reportsApi.technicianActivity(periodArg), [
    period.dateFrom,
    period.dateTo,
  ]);
  const business = useFetch(() => reportsApi.businessClientActivity(periodArg), [
    period.dateFrom,
    period.dateTo,
  ]);
  const workload = useFetch(() => reportsApi.technicianWorkload(), []);

  const changePeriod = (e) =>
    setPeriod((p) => ({ ...p, [e.target.name]: e.target.value }));

  const clearPeriod = () => setPeriod({ dateFrom: '', dateTo: '' });

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2>Аналітика</h2>
          <p className="hint">
            Фільтр за датою створення заявки (необов&apos;язково). Завантаженість майстрів — поточний зріз.
          </p>
          <div className="request-filters canvas-filters analytics-period-filters">
            <Input
              label="Дата з"
              type="date"
              name="dateFrom"
              value={period.dateFrom}
              onChange={changePeriod}
            />
            <Input
              label="Дата по"
              type="date"
              name="dateTo"
              value={period.dateTo}
              onChange={changePeriod}
            />
            <Button type="button" variant="ghost" size="sm" onClick={clearPeriod}>
              Увесь період
            </Button>
          </div>
        </section>

        <Section title="Завантаженість майстрів (активні заявки)" query={workload}>
        {(rows) => (
          <ul className="analytics-list">
            {rows.map((t) => (
              <li key={t.id}>
                {t.first_name} {t.last_name}: активних {t.active_count}, усього призначено {t.total_assigned}
              </li>
            ))}
          </ul>
        )}
        </Section>

        <Section title="Заявки за статусом" query={byStatus}>
        {(rows) => (
          <ul className="analytics-list">
            {rows.map((r) => (
              <li key={r.status}>
                {STATUS_LABELS[r.status] || r.status}: {r.count}
              </li>
            ))}
          </ul>
        )}
        </Section>

        <Section title="Активність майстрів" query={technicians}>
        {(rows) => (
          <ul className="analytics-list">
            {rows.map((t) => (
              <li key={t.id}>
                {t.first_name} {t.last_name}: {t.completed}/{t.total_requests}
              </li>
            ))}
          </ul>
        )}
        </Section>

        <Section title="Бізнес-клієнти" query={business}>
        {(rows) => (
          <ul className="analytics-list">
            {rows.map((b) => (
              <li key={b.id}>
                {b.company_name}: {b.total_requests} заявок
              </li>
            ))}
          </ul>
        )}
        </Section>
      </div>
    </Layout>
  );
}
