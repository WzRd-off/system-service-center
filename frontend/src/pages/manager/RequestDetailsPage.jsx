import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { RequestStatus } from '../../components/requests/RequestStatus.jsx';
import { CommentList } from '../../components/comments/CommentList.jsx';
import { CommentForm } from '../../components/comments/CommentForm.jsx';
import { Select } from '../../components/common/Select.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';
import { commentsApi } from '../../api/comments.api.js';
import { mastersApi } from '../../api/masters.api.js';
import { STATUS_LABELS } from '../../constants/statuses.js';
import { SERVICE_TYPE_LABELS } from '../../constants/serviceTypes.js';
import { formatDateTime } from '../../utils/formatters.js';
import { PaginationBar, PAGE_SIZE } from '../../components/common/PaginationBar.jsx';
import { sanitizeAddress, sanitizeLongText } from '../../utils/validators.js';

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const serviceTypeOptions = [
  { value: '', label: '— не вказано —' },
  ...Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
];

const contactOptions = [
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'Email' },
  { value: 'messenger', label: 'Месенджер' },
];

function buildEditState(r) {
  return {
    description: r.description || '',
    preferred_contact: r.preferred_contact || 'phone',
    service_type: r.service_type || '',
    service_address: r.address || '',
    client_comment: r.comment || '',
  };
}

function ClientOtherRequestsSection({ clientUserId, currentRequestId }) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [clientUserId]);

  const { data, loading, error } = useFetch(
    () =>
      requestsApi.list({
        clientUserId,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      }),
    [clientUserId, page]
  );

  if (!clientUserId) return null;

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <section className="canvas-card">
      <h3>Інші заявки клієнта</h3>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p>Не вдалося завантажити список</p>
      ) : total === 0 ? (
        <p>Інших заявок немає</p>
      ) : (
        <>
          <ul className="analytics-list">
            {items.map((row) => (
              <li key={row.id}>
                {String(row.id) === String(currentRequestId) ? (
                  <span className="hint">№ {row.request_number} (поточна заявка)</span>
                ) : (
                  <>
                    <Link to={`/manager/requests/${row.id}`}>№ {row.request_number}</Link>
                    {' — '}
                    {STATUS_LABELS[row.status] || row.status}
                    {' — '}
                    {formatDateTime(row.created_at)}
                  </>
                )}
              </li>
            ))}
          </ul>
          <PaginationBar
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}

function ManagerRequestDetailsBody({ r, id, onRequestReload }) {
  const comments = useFetch(() => commentsApi.listByRequest(id), [id]);
  const technicians = useFetch(() => mastersApi.list(), []);
  const [technicianId, setTechnicianId] = useState('');
  const [edit, setEdit] = useState(() => buildEditState(r));
  const [savingEdit, setSavingEdit] = useState(false);

  const updateStatus = async (status) => {
    await requestsApi.updateStatus(id, status);
    onRequestReload();
  };

  const assign = async (e) => {
    e.preventDefault();
    if (!technicianId) return;
    await requestsApi.assignTechnician(id, Number(technicianId));
    setTechnicianId('');
    onRequestReload();
  };

  const sendComment = async (text) => {
    await commentsApi.create({ requestId: Number(id), text });
    comments.reload();
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await requestsApi.update(id, {
        description: edit.description,
        preferred_contact: edit.preferred_contact || null,
        service_type: edit.service_type || null,
        service_address: edit.service_address || null,
        client_comment: edit.client_comment || null,
      });
      await onRequestReload();
    } finally {
      setSavingEdit(false);
    }
  };

  const technicianOptions = [
    { value: '', label: '— оберіть майстра —' },
    ...(technicians.data || []).map((t) => ({
      value: String(t.id),
      label: `${t.first_name || ''} ${t.last_name || ''}`.trim() || t.email,
    })),
  ];

  return (
    <div className="canvas-stack">
      <section className="canvas-card canvas-card--compact">
        <h2>Заявка № {r.request_number}</h2>
        <RequestStatus status={r.status} />
      </section>

      <section className="request-details canvas-card">
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
          {r.service_type && (
            <>
              <dt>Тип обслуговування</dt>
              <dd>{SERVICE_TYPE_LABELS[r.service_type] || r.service_type}</dd>
            </>
          )}
          <dt>Опис проблеми</dt><dd>{r.description}</dd>
          {r.comment && (<><dt>Коментар клієнта</dt><dd>{r.comment}</dd></>)}
          <dt>Призначений майстер</dt>
          <dd>
            {r.technician_name || (r.assigned_technician_id ? `ID ${r.assigned_technician_id}` : 'не призначено')}
          </dd>
        </dl>
      </section>

      <section className="canvas-card">
        <h3>Редагування заявки</h3>
        <form onSubmit={saveEdit} className="section-stack">
          <Input
            type="textarea"
            label="Опис проблеми"
            name="description"
            value={edit.description}
            onChange={(e) => setEdit({ ...edit, description: sanitizeLongText(e.target.value) })}
            required
          />
          <Select
            label="Бажаний спосіб зв'язку"
            name="preferred_contact"
            value={edit.preferred_contact}
            options={contactOptions}
            onChange={(e) => setEdit({ ...edit, preferred_contact: e.target.value })}
          />
          <Select
            label="Тип обслуговування"
            name="service_type"
            value={edit.service_type}
            options={serviceTypeOptions}
            onChange={(e) => setEdit({ ...edit, service_type: e.target.value })}
          />
          <Input
            label="Адреса об'єкта / обслуговування"
            name="service_address"
            value={edit.service_address}
            onChange={(e) => setEdit({ ...edit, service_address: sanitizeAddress(e.target.value) })}
          />
          <Input
            type="textarea"
            label="Коментар клієнта"
            name="client_comment"
            value={edit.client_comment}
            onChange={(e) => setEdit({ ...edit, client_comment: sanitizeLongText(e.target.value) })}
          />
          <Button type="submit" loading={savingEdit}>Зберегти зміни</Button>
        </form>
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

      <section className="canvas-card">
        <h3>Зміна статусу</h3>
        <Select
          options={statusOptions}
          value={r.status}
          onChange={(e) => updateStatus(e.target.value)}
        />
      </section>

      <section className="canvas-card">
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
        <section className="canvas-card">
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

      <ClientOtherRequestsSection clientUserId={r.user_id} currentRequestId={id} />

      <section className="canvas-card">
        <h3>Коментарі</h3>
        <CommentList comments={comments.data || []} />
        <CommentForm onSubmit={sendComment} />
      </section>
    </div>
  );
}

export function ManagerRequestDetailsPage() {
  const { id } = useParams();
  const request = useFetch(() => requestsApi.getById(id), [id]);
  const r = request.data;

  if (request.loading) return <Layout><Spinner /></Layout>;
  if (!r) return <Layout><p>Заявку не знайдено</p></Layout>;

  return (
    <Layout>
      <ManagerRequestDetailsBody
        key={`${r.id}-${r.updated_at || ''}`}
        r={r}
        id={id}
        onRequestReload={request.reload}
      />
    </Layout>
  );
}
