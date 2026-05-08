import { useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { Select } from '../../components/common/Select.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { mastersApi } from '../../api/masters.api.js';
import { STATUS_LABELS } from '../../constants/statuses.js';

const statusOptions = [
  { value: 'all', label: 'Усі статуси' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }))
];

export function AssignedRequestsPage() {
  const { data, loading, error } = useFetch(() => mastersApi.getAssignedRequests());
  const [filter, setFilter] = useState('all');

  const filteredData = data?.filter(r => filter === 'all' || r.status === filter) || [];

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
            <RequestList requests={filteredData} basePath="/master/requests" />
          )}
        </section>
      </div>
    </Layout>
  );
}