import { Link, useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { equipmentApi } from '../../api/equipment.api.js';
import { ROLES } from '../../constants/roles.js';
import { ROUTES } from '../../constants/routes.js';
import { STATUS_LABELS } from '../../constants/statuses.js';
import { formatDateTime } from '../../utils/formatters.js';

function requestPathForRole(role, requestId) {
  if (role === ROLES.BUSINESS_CLIENT) return `/business/history/${requestId}`;
  return `/client/requests/${requestId}`;
}

export function DeviceHistoryPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const history = useFetch(() => equipmentApi.getHistory(id), [id]);

  const backPath =
    user?.role === ROLES.BUSINESS_CLIENT ? ROUTES.BUSINESS.DEVICES : ROUTES.CLIENT.DEVICES;

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <p>
            <Link to={backPath}>← До списку техніки</Link>
          </p>
          <h2>Історія заявок по техніці</h2>
        </section>

        <section className="canvas-card">
          {history.loading ? (
            <Spinner />
          ) : history.error ? (
            <ErrorMessage error={history.error} />
          ) : !(history.data || []).length ? (
            <p>Заявок для цього пристрою ще не було</p>
          ) : (
            <ul className="analytics-list">
              {(history.data || []).map((row) => (
                <li key={row.id}>
                  <Link to={requestPathForRole(user?.role, row.id)}>
                    № {row.request_number}
                  </Link>
                  {' — '}
                  {STATUS_LABELS[row.status] || row.status}
                  {' — '}
                  {formatDateTime(row.created_at)}
                  {row.description && (
                    <>
                      <br />
                      <small className="hint">{row.description}</small>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
