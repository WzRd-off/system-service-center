import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { PaginationBar, PAGE_SIZE } from '../../components/common/PaginationBar.jsx';
import { Select } from '../../components/common/Select.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { mastersApi } from '../../api/masters.api.js';
import { STATUS_LABELS } from '../../constants/statuses.js';

const statusOptions = [
  { value: 'all', label: 'Усі статуси' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

export function AssignedRequestsPage() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  const params = {
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    ...(filter !== 'all' ? { status: filter } : {}),
  };

  const { data, loading, error } = useFetch(
    () => mastersApi.getAssignedRequests(params),
    [page, filter]
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card">
          <div className="canvas-header">
            <h2>Призначені заявки</h2>
            <div className="status-filter-wrap">
              <Select
                name="statusFilter"
                value={filter}
                options={statusOptions}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
        </section>
        <section className="canvas-card">
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <>
              <RequestList requests={items} basePath="/master/requests" />
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
