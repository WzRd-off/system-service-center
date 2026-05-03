import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';
import { formatDate } from '../../utils/formatters.js';

export function MaintenancePlansPage() {
  const { data, loading } = useFetch(() => businessClientsApi.getMaintenancePlans());

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <h2>Планове обслуговування</h2>
      {!data?.length ? <p>Планів немає</p> : (
        <ul className="maintenance-plans">
          {data.map((p) => (
            <li key={p.id}>
              <strong>{formatDate(p.schedule_date)}</strong> — {p.type}
              {p.device_model && <span> ({p.device_type} {p.device_model})</span>}
              {p.notes && <p>{p.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
