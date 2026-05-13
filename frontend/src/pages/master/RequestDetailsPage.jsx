import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { RequestStatus } from '../../components/requests/RequestStatus.jsx';
import { Select } from '../../components/common/Select.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { CommentList } from '../../components/comments/CommentList.jsx';
import { CommentForm } from '../../components/comments/CommentForm.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';
import { mastersApi } from '../../api/masters.api.js';
import { commentsApi } from '../../api/comments.api.js';
import { STATUS_LABELS } from '../../constants/statuses.js';
import { formatDateTime } from '../../utils/formatters.js';
import { sanitizeLongText } from '../../utils/validators.js';

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function MasterRequestDetailsPage() {
  const { id } = useParams();
  const request = useFetch(() => requestsApi.getById(id), [id]);
  const comments = useFetch(() => commentsApi.listByRequest(id), [id]);
  
  const [report, setReport] = useState({
    diagnosticResult: '',
    workDescription: '',
    usedParts: '',
  });
  const [notifying, setNotifying] = useState(false);

  useEffect(() => {
    if (request.data?.work_report) {
      setReport({
        diagnosticResult: request.data.work_report.diagnostic_result || '',
        workDescription: request.data.work_report.work_description || '',
        usedParts: request.data.work_report.used_parts || '',
      });
    }
  }, [request.data]);

  if (request.loading) return <Layout><Spinner /></Layout>;
  if (!request.data) return <Layout><p>Заявку не знайдено</p></Layout>;

  const r = request.data;

  const updateStatus = async (status) => {
    await mastersApi.updateRequestStatus(id, status);
    request.reload();
  };

  const submitReport = async (e) => {
    e.preventDefault();
    await mastersApi.addWorkReport({ ...report, requestId: Number(id) });
    request.reload();
  };

  const sendComment = async (text) => {
    await commentsApi.create({ requestId: Number(id), text });
    comments.reload();
  };

  const notifyComplete = async () => {
    setNotifying(true);
    try {
      // ИСПРАВЛЕНО: Назва методу синхронізована з бекендом
      await mastersApi.notifyCompletion(id);
      await mastersApi.updateRequestStatus(id, 'completed');
      request.reload();
    } finally {
      setNotifying(false);
    }
  };

  return (
    <Layout>
      <div className="canvas-stack">
      <section className="canvas-card canvas-card--compact">
        <h2>Заявка № {r.request_number}</h2>
        <RequestStatus status={r.status} />
      </section>

      <section className="request-details canvas-card">
        <h3>Деталі</h3>
        <dl>
          <dt>Створено</dt><dd>{formatDateTime(r.created_at)}</dd>
          <dt>Тип техніки</dt><dd>{r.type || '—'}</dd>
          <dt>Виробник</dt><dd>{r.manufacturer || '—'}</dd>
          <dt>Модель</dt><dd>{r.model || '—'}</dd>
          <dt>Серійний номер</dt><dd>{r.serial_number || '—'}</dd>
          {r.address && (<><dt>Адреса</dt><dd>{r.address}</dd></>)}
          <dt>Клієнт</dt>
          <dd>{r.client_name || r.contact_person || '—'}</dd>
          <dt>Телефон</dt><dd>{r.contact_phone || '—'}</dd>
          <dt>Опис проблеми</dt><dd>{r.description}</dd>
          {r.comment && (<><dt>Коментар</dt><dd>{r.comment}</dd></>)}
        </dl>
      </section>

      <section className="canvas-card">
        <h3>Зміна статусу</h3>
        <Select
          options={statusOptions}
          value={r.status}
          onChange={(e) => updateStatus(e.target.value)}
        />
      </section>

      <section className="canvas-card">
        <h3>Звіт майстра</h3>
        <form onSubmit={submitReport}>
          <Input
            label="Діагностика"
            value={report.diagnosticResult}
            onChange={(e) => setReport({ ...report, diagnosticResult: sanitizeLongText(e.target.value) })}
          />
          <Input
            label="Виконані роботи"
            value={report.workDescription}
            onChange={(e) => setReport({ ...report, workDescription: sanitizeLongText(e.target.value) })}
          />
          <Input
            label="Запчастини"
            value={report.usedParts}
            onChange={(e) => setReport({ ...report, usedParts: sanitizeLongText(e.target.value) })}
          />
          <div className="form-actions">
            <Button type="submit">Зберегти звіт</Button>
            <Button
              type="button"
              variant="outline"
              loading={notifying}
              onClick={notifyComplete}
            >
              Повідомити про завершення
            </Button>
          </div>
        </form>
      </section>

      <section className="canvas-card">
        <h3>Коментарі</h3>
        <CommentList comments={comments.data || []} />
        <CommentForm onSubmit={sendComment} />
      </section>
      </div>
    </Layout>
  );
}