import { useState } from 'react';
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

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

export function MasterRequestDetailsPage() {
  const { id } = useParams();
  const request = useFetch(() => requestsApi.getById(id), [id]);
  const comments = useFetch(() => commentsApi.listByRequest(id), [id]);
  const [report, setReport] = useState({ diagnosticResult: '', workDescription: '', usedParts: '' });

  if (request.loading) return <Layout><Spinner /></Layout>;
  if (!request.data) return <Layout><p>Заявку не знайдено</p></Layout>;

  const updateStatus = async (status) => {
    await mastersApi.updateRequestStatus(id, status);
    request.reload();
  };

  const submitReport = async (e) => {
    e.preventDefault();
    await mastersApi.addWorkReport({ ...report, requestId: Number(id) });
    setReport({ diagnosticResult: '', workDescription: '', usedParts: '' });
  };

  const sendComment = async (text) => {
    await commentsApi.create({ requestId: Number(id), text });
    comments.reload();
  };

  return (
    <Layout>
      <h2>Заявка № {request.data.request_number}</h2>
      <RequestStatus status={request.data.status} />
      <p>{request.data.description}</p>

      <section>
        <h3>Статус виконання</h3>
        <Select options={statusOptions} value={request.data.status} onChange={(e) => updateStatus(e.target.value)} />
      </section>

      <section>
        <h3>Звіт про виконані роботи</h3>
        <form onSubmit={submitReport}>
          <Input label="Результат діагностики" value={report.diagnosticResult}
            onChange={(e) => setReport({ ...report, diagnosticResult: e.target.value })} />
          <Input label="Виконані роботи" value={report.workDescription}
            onChange={(e) => setReport({ ...report, workDescription: e.target.value })} />
          <Input label="Використані запчастини" value={report.usedParts}
            onChange={(e) => setReport({ ...report, usedParts: e.target.value })} />
          <Button type="submit">Зберегти звіт</Button>
        </form>
      </section>

      <section>
        <h3>Коментарі</h3>
        <CommentList comments={comments.data || []} />
        <CommentForm onSubmit={sendComment} />
      </section>
    </Layout>
  );
}
