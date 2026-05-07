import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';

const HISTORY_STATUSES = ['completed', 'delivered', 'cancelled'];

export function ClientHistoryPage() {
  const { data, loading, error } = useFetch(() => requestsApi.list());

  // Фильтруем только завершенные или отмененные заявки
  const historyRequests = data?.filter(r => HISTORY_STATUSES.includes(r.status)) || [];

  return (
    <Layout>
      <h2>Історія заявок</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <RequestList requests={historyRequests} basePath="/client/requests" />
      )}
    </Layout>
  );
}