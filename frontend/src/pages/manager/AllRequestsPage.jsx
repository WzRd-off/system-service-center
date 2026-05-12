import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { RequestFilters } from '../../components/requests/RequestFilters.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { PaginationBar, PAGE_SIZE } from '../../components/common/PaginationBar.jsx';
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
  const [page, setPage] = useState(0);
  const technicians = useFetch(() => mastersApi.list(), []);

  const filterQuery = buildQuery(filters);
  const filterQueryKey = JSON.stringify(filterQuery);

  useEffect(() => {
    setPage(0);
  }, [filterQueryKey]);

  const requests = useFetch(
    () =>
      requestsApi.list({
        ...filterQuery,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      }),
    [page, filterQueryKey]
  );

  const items = requests.data?.items ?? [];
  const total = requests.data?.total ?? 0;

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
            <>
              <RequestList requests={items} basePath="/manager/requests" />
              <PaginationBar
                page={page}
                pageSize={PAGE_SIZE}
                total={total}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>
    </Layout>
  );
}
