import { useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { RequestStatus } from '../../components/requests/RequestStatus.jsx';
import { CommentList } from '../../components/comments/CommentList.jsx';
import { CommentForm } from '../../components/comments/CommentForm.jsx';
import { Select } from '../../components/common/Select.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';
import { commentsApi } from '../../api/comments.api.js';
import { STATUS_LABELS } from '../../constants/statuses.js';
import { useState } from 'react';

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

export function ManagerRequestDetailsPage() {
  const { id } = useParams();
  const request = useFetch(() => requestsApi.getById(id), [id]);
  const comments = useFetch(() => commentsApi.listByRequest(id), [id]);
  const [technicianId, setTechnicianId] = useState('');

  if (request.loading) return <Layout><Spinner /></Layout>;
  if (!request.data) return <Layout><p>Заявку не знайдено</p></Layout>;

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

  return (
    <Layout>
      <h2>Заявка № {request.data.request_number}</h2>
      <RequestStatus status={request.data.status} />
      <p>{request.data.description}</p>

      <section>
        <h3>Зміна статусу</h3>
        <Select
          options={statusOptions}
          value={request.data.status}
          onChange={(e) => updateStatus(e.target.value)}
        />
      </section>

      <section>
        <h3>Призначити майстра</h3>
        <form onSubmit={assign}>
          <Input
            label="ID майстра"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
          />
          <Button type="submit">Призначити</Button>
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
