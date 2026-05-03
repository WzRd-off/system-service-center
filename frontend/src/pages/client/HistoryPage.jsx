import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';
import { Spinner } from '../../components/common/Spinner.jsx';

export function ClientHistoryPage() {
  const { data, loading } = useFetch(() => requestsApi.list());

  return (
    <Layout>
      <h2>Історія звернень</h2>
      {loading ? <Spinner /> : <RequestList requests={data} basePath="/client/requests" />}
    </Layout>
  );
}
