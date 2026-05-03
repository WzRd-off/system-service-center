import { Layout } from '../../components/layout/Layout.jsx';
import { RequestList } from '../../components/requests/RequestList.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { mastersApi } from '../../api/masters.api.js';

export function AssignedRequestsPage() {
  const { data, loading, error } = useFetch(() => mastersApi.getAssignedRequests());

  return (
    <Layout>
      <h2>Призначені заявки</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <RequestList requests={data} basePath="/master/requests" />
      )}
    </Layout>
  );
}
