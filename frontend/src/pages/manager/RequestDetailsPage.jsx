import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { RequestStatus } from '../../components/requests/RequestStatus.jsx';
import { CommentList } from '../../components/comments/CommentList.jsx';
import { CommentForm } from '../../components/comments/CommentForm.jsx';
import { Select } from '../../components/common/Select.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';
import { commentsApi } from '../../api/comments.api.js';
import { mastersApi } from '../../api/masters.api.js';
import { STATUS_LABELS } from '../../constants/statuses.js';
import { formatDateTime } from '../../utils/formatters.js';

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function ManagerRequestDetailsPage() {
  const { id } = useParams();
  const request = useFetch(() => requestsApi.getById(id), [id]);
  const comments = useFetch(() => commentsApi.listByRequest(id), [id]);
  const technicians = useFetch(() => mastersApi.list(), []);
  const [technicianId, setTechnicianId] = useState('');

  if (request.loading) return <Layout><Spinner /></Layout>;
  if (!request.data) return <Layout><p>Заявку не знайдено</p></Layout>;

  const r = request.data;

  const updateStatus = async (status) => {
    await requestsApi.updateStatus(id, status);
    request.reload();
  };

  const assign = async (e) => {
    e.preventDefault();
    if (!technicianId) return;
    await requestsApi.assignTechnician(id, Number(technicianId));
    request.reload();
  };

  const sendComment = async (text) => {
    await commentsApi.create({ requestId: Number(id), text });
    comments.reload();
  };

  const technicianOptions = [
    { value: '', label: '— оберіть майстра —' },
    ...(technicians.data || []).map((t) => ({
      value: String(t.id),
      label: `${t.first_name || ''} ${t.last_name || ''}`.trim() || t.email,
    })),
  ];

  return (
    <Layout>
      <h2>Заявка № {r.request_number}</h2>
      <RequestStatus status={r.status} />

      <section className="request-details">
        <h3>Інформація про заявку</h3>
        <dl>
          <dt>Створено</dt><dd>{formatDateTime(r.created_at)}</dd>
          <dt>Клієнт</dt>
          <dd>
            {r.client_name || r.contact_person || '—'}
            {r.company_name && ` (${r.company_name})`}
          </dd>
          <dt>Телефон</dt><dd>{r.contact_phone || '—'}</dd>
          <dt>Email</dt><dd>{r.contact_email || '—'}</dd>
          <dt>Бажаний спосіб зв'язку</dt><dd>{r.preferred_contact || '—'}</dd>
          <dt>Тип техніки</dt><dd>{r.type || '—'}</dd>
          <dt>Виробник / Модель</dt>
          <dd>{[r.manufacturer, r.model].filter(Boolean).join(' ') || '—'}</dd>
          <dt>Серійний номер</dt><dd>{r.serial_number || '—'}</dd>
          {r.address && (<><dt>Адреса об'єкта</dt><dd>{r.address}</dd></>)}
          {r.service_type && (<><dt>Тип обслуговування</dt><dd>{r.service_type}</dd></>)}
          <dt>Опис проблеми</dt><dd>{r.description}</dd>
          {r.comment && (<><dt>Коментар клієнта</dt><dd>{r.comment}</dd></>)}
          <dt>Призначений майстер</dt>
          <dd>
            {r.technician_name || (r.technician_id ? `ID ${r.technician_id}` : 'не призначено')}
          </dd>
        </dl>
      </section>

      <section>
        <h3>Зміна статусу</h3>
        <Select
          options={statusOptions}
          value={r.status}
          onChange={(e) => updateStatus(e.target.value)}
        />
      </section>

      <section>
        <h3>Призначити майстра</h3>
        <form onSubmit={assign} className="assign-form">
          <Select
            label="Майстер"
            options={technicianOptions}
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
          />
          <Button type="submit" disabled={!technicianId}>Призначити</Button>
        </form>
      </section>

      {r.work_report && (
        <section>
          <h3>Звіт майстра</h3>
          <dl>
            {r.work_report.diagnostic_result && (
              <>
                <dt>Діагностика</dt>
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
                <dt>Запчастини</dt>
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
