import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';

export function ServiceHistoryPage() {
  const { data, loading } = useFetch(() => businessClientsApi.getRequests());

  return (
    <Layout>
      <h2>Історія обслуговування</h2>
      {loading ? <Spinner /> : <RequestList requests={data} basePath="/business/requests" />}
    </Layout>
  );
}
