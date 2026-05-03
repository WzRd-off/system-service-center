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

  const r = request.data;

  return (
    <Layout>
      <h2>Заявка № {r.request_number}</h2>
      <RequestStatus status={r.status} />

      <section>
        <h3>Деталі заявки</h3>
        <dl>
          <dt>Створено</dt><dd>{formatDateTime(r.created_at)}</dd>
          <dt>Тип техніки</dt><dd>{r.type || '—'}</dd>
          <dt>Виробник / Модель</dt>
          <dd>{[r.manufacturer, r.model].filter(Boolean).join(' ') || '—'}</dd>
          <dt>Серійний номер</dt><dd>{r.serial_number || '—'}</dd>
          <dt>Опис проблеми</dt><dd>{r.description}</dd>
          <dt>Призначений майстер</dt>
          <dd>{r.technician_name || 'не призначено'}</dd>
        </dl>
      </section>

      {r.work_report && (
        <section>
          <h3>Звіт про виконані роботи</h3>
          <dl>
            {r.work_report.diagnostic_result && (
              <>
                <dt>Результат діагностики</dt>
                <dd>{r.work_report.diagnostic_result}</dd>
              </>
            )}
            {r.work_report.work_description && (
              <>
                <dt>Виконані роботи</dt>
                <dd>{r.work_report.work_description}</dd>
              </>
            )}
            {r.work_report.used_parts && (
              <>
                <dt>Використані запчастини</dt>
                <dd>{r.work_report.used_parts}</dd>
              </>
            )}
          </dl>
        </section>
      )}

      <section>
        <h3>Коментарі</h3>
        <CommentList comments={comments.data || []} />
        <CommentForm onSubmit={sendComment} />
      </section>
    </Layout>
  );
}
