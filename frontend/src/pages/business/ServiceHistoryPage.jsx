import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';

export function ServiceHistoryPage() {
  const { data, loading, error } = useFetch(() => businessClientsApi.getRequests());

  return (
    <Layout>
      <h2>Історія обслуговування</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <RequestList requests={data} basePath="/business/history" />
      )}
    </Layout>
  );
}
