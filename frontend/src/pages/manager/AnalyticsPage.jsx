import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { reportsApi } from '../../api/reports.api.js';
import { STATUS_LABELS } from '../../constants/statuses.js';

export function AnalyticsPage() {
  const byStatus = useFetch(() => reportsApi.requestsByStatus());
  const technicians = useFetch(() => reportsApi.technicianActivity());
  const business = useFetch(() => reportsApi.businessClientActivity());

  if (byStatus.loading || technicians.loading || business.loading) {
    return <Layout><Spinner /></Layout>;
  }

  return (
    <Layout>
      <h2>Аналітика</h2>

      <section>
        <h3>Заявки за статусом</h3>
        <ul>
          {byStatus.data.map((r) => (
            <li key={r.status}>{STATUS_LABELS[r.status] || r.status}: {r.count}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Активність майстрів</h3>
        <ul>
          {technicians.data.map((t) => (
            <li key={t.id}>{t.first_name} {t.last_name}: {t.completed}/{t.total_requests}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Бізнес-клієнти</h3>
        <ul>
          {business.data.map((b) => (
            <li key={b.id}>{b.company_name}: {b.total_requests} заявок</li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
