import { useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { RequestFilters } from '../../components/requests/RequestFilters.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';

export function AllRequestsPage() {
  const [filters, setFilters] = useState({});
  const { data, loading } = useFetch(() => requestsApi.list(filters), [JSON.stringify(filters)]);

  return (
    <Layout>
      <h2>Усі заявки</h2>
      <RequestFilters filters={filters} onChange={setFilters} />
      {loading ? <Spinner /> : <RequestList requests={data} basePath="/manager/requests" />}
    </Layout>
  );
}
