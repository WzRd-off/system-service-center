import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';

export function MyRequestsPage() {
  const { data, loading, error } = useFetch(() => requestsApi.list());

  return (
    <Layout>
      <h2>Мої заявки</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <RequestList requests={data} basePath="/client/requests" />
      )}
    </Layout>
  );
}
