import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';

const ACTIVE_STATUSES = [
  'new_request', 'accepted', 'awaiting_clarification', 
  'technician_assigned', 'diagnostics_in_progress', 
  'awaiting_approval', 'repair_in_progress', 'awaiting_parts'
];

export function MyRequestsPage() {
  const { data, loading, error } = useFetch(() => requestsApi.list());

  const activeRequests = data?.filter(r => ACTIVE_STATUSES.includes(r.status)) || [];

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2>Мої заявки</h2>
        </section>
        <section className="canvas-card">
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <RequestList requests={activeRequests} basePath="/client/requests" />
          )}
        </section>
      </div>
    </Layout>
  );
}