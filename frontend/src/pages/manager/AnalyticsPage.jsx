import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { reportsApi } from '../../api/reports.api.js';
import { STATUS_LABELS } from '../../constants/statuses.js';

function Section({ title, query, children }) {
  return (
    <section>
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
  const byStatus = useFetch(() => reportsApi.requestsByStatus());
  const technicians = useFetch(() => reportsApi.technicianActivity());
  const business = useFetch(() => reportsApi.businessClientActivity());

  return (
    <Layout>
      <h2>Аналітика</h2>

      <Section title="Заявки за статусом" query={byStatus}>
        {(rows) => (
          <ul>
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
          <ul>
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
          <ul>
            {rows.map((b) => (
              <li key={b.id}>
                {b.company_name}: {b.total_requests} заявок
              </li>
            ))}
          </ul>
        )}
      </Section>
    </Layout>
  );
}
