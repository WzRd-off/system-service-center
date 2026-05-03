import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { RequestForm } from '../../components/requests/RequestForm.jsx';
import { requestsApi } from '../../api/requests.api.js';
import { ROUTES } from '../../constants/routes.js';

export function NewRequestPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await requestsApi.create(data);
    navigate(ROUTES.CLIENT.REQUESTS);
  };

  return (
    <Layout>
      <h2>Нова заявка</h2>
      <RequestForm onSubmit={handleSubmit} />
    </Layout>
  );
}
