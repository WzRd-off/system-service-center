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
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact new-request-page-header">
          <h2 className="page-title">Нова заявка на обслуговування</h2>
          <p className="new-request-page-subtitle">
            Заповніть інформацію про пристрій та опишіть проблему. Наші фахівці зв'яжуться з вами найближчим часом.
          </p>
        </section>
        <section className="canvas-card form-container">
          <RequestForm onSubmit={handleSubmit} />
        </section>
      </div>
    </Layout>
  );
}
