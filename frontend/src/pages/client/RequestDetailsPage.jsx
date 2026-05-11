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
import { STATUS_LABELS } from '../../constants/statuses.js';
import { PREFERRED_CONTACT_LABELS, SERVICE_TYPE_LABELS } from '../../constants/serviceTypes.js';

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
      <div className="canvas-stack">
      <section className="canvas-card canvas-card--compact">
        <h2>Заявка № {r.request_number}</h2>
        <RequestStatus status={r.status} />
      </section>

      <section className="canvas-card">
        <h3>Деталі заявки</h3>
        <dl>
          <dt>Створено</dt><dd>{formatDateTime(r.created_at)}</dd>
          <dt>Телефон</dt><dd>{r.contact_phone || '—'}</dd>
          <dt>Email</dt><dd>{r.contact_email || '—'}</dd>
          <dt>Бажаний спосіб зв&apos;язку</dt>
          <dd>{PREFERRED_CONTACT_LABELS[r.preferred_contact] || r.preferred_contact || '—'}</dd>
          {r.address && (<><dt>Адреса</dt><dd>{r.address}</dd></>)}
          {r.service_type && (
            <>
              <dt>Тип обслуговування</dt>
              <dd>{SERVICE_TYPE_LABELS[r.service_type] || r.service_type}</dd>
            </>
          )}
          <dt>Тип техніки</dt><dd>{r.type || '—'}</dd>
          <dt>Виробник / Модель</dt>
          <dd>{[r.manufacturer, r.model].filter(Boolean).join(' ') || '—'}</dd>
          <dt>Серійний номер</dt><dd>{r.serial_number || '—'}</dd>
          <dt>Опис проблеми</dt><dd>{r.description}</dd>
          {r.comment && (<><dt>Коментар</dt><dd>{r.comment}</dd></>)}
          <dt>Призначений майстер</dt>
          <dd>{r.technician_name || 'не призначено'}</dd>
        </dl>
      </section>

      {(r.status_history || []).length > 0 && (
        <section className="canvas-card">
          <h3>Історія змін статусу</h3>
          <ul className="analytics-list">
            {(r.status_history || []).map((h) => (
              <li key={h.id}>
                {formatDateTime(h.changed_at)}:{' '}
                {h.old_status ? STATUS_LABELS[h.old_status] || h.old_status : '—'} →{' '}
                {STATUS_LABELS[h.new_status] || h.new_status}
                {h.changer_email ? ` (${h.changer_email})` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}

      {r.work_report && (
        <section className="canvas-card">
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

      <section className="canvas-card">
        <h3>Коментарі</h3>
        <CommentList comments={comments.data || []} />
        <CommentForm onSubmit={sendComment} />
      </section>
      </div>
    </Layout>
  );
}
