import { useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { RequestFilters } from '../../components/requests/RequestFilters.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';
import { mastersApi } from '../../api/masters.api.js';

const INITIAL_FILTERS = {
  status: '',
  dateFrom: '',
  dateTo: '',
  client: '',
  technicianId: '',
};

function buildQuery(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  );
}

export function AllRequestsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const technicians = useFetch(() => mastersApi.list(), []);
  const query = buildQuery(filters);
  const requests = useFetch(
    () => requestsApi.list(query),
    [JSON.stringify(query)]
  );

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2>Усі заявки</h2>
        </section>
        <section className="canvas-card">
          <RequestFilters
            filters={filters}
            onChange={setFilters}
            technicians={technicians.data || []}
          />
        </section>
        <section className="canvas-card">
          {requests.loading ? (
            <Spinner />
          ) : requests.error ? (
            <ErrorMessage error={requests.error} />
          ) : (
            <RequestList requests={requests.data} basePath="/manager/requests" />
          )}
        </section>
      </div>
    </Layout>
  );
}
