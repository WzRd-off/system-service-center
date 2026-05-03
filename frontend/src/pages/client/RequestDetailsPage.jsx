import { useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { RequestStatus } from '../../components/requests/RequestStatus.jsx';
import { CommentList } from '../../components/comments/CommentList.jsx';
import { CommentForm } from '../../components/comments/CommentForm.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';
import { commentsApi } from '../../api/comments.api.js';
import { formatDateTime } from '../../utils/formatters.js';

export function ClientRequestDetailsPage() {
  const { id } = useParams();
  const request = useFetch(() => requestsApi.getById(id), [id]);
  const comments = useFetch(() => commentsApi.listByRequest(id), [id]);

  const sendComment = async (text) => {
    await commentsApi.create({ requestId: Number(id), text });
    comments.reload();
  };

  if (request.loading) return <Layout><Spinner /></Layout>;
  if (!request.data) return <Layout><p>Заявку не знайдено</p></Layout>;

  return (
    <Layout>
      <h2>Заявка № {request.data.request_number}</h2>
      <RequestStatus status={request.data.status} />
      <p>{request.data.description}</p>
      <small>Створено: {formatDateTime(request.data.created_at)}</small>

      <section>
        <h3>Коментарі</h3>
        <CommentList comments={comments.data || []} />
        <CommentForm onSubmit={sendComment} />
      </section>
    </Layout>
  );
}
