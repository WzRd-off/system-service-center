import { useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { PaginationBar, PAGE_SIZE } from '../../components/common/PaginationBar.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';

const HISTORY_STATUSES = ['completed', 'delivered', 'cancelled'];
const STATUS_IN_QUERY = HISTORY_STATUSES.join(',');

export function ClientHistoryPage() {
  const [page, setPage] = useState(0);
  const { data, loading, error } = useFetch(
    () =>
      requestsApi.list({
        statusIn: STATUS_IN_QUERY,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      }),
    [page]
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2>Історія заявок</h2>
        </section>
        <section className="canvas-card">
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <>
              <RequestList requests={items} basePath="/client/requests" />
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
