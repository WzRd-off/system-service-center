import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { RequestForm } from '../../components/requests/RequestForm.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { requestsApi } from '../../api/requests.api.js';
import { equipmentApi } from '../../api/equipment.api.js';
import { ROUTES } from '../../constants/routes.js';

export function NewRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const devices = useFetch(
    () => (user?.id ? equipmentApi.listByClient(user.id) : Promise.resolve([])),
    [user?.id]
  );

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
          {devices.loading ? (
            <Spinner />
          ) : (
            <RequestForm
              onSubmit={handleSubmit}
              equipmentSelect
              devices={devices.data || []}
            />
          )}
        </section>
      </div>
    </Layout>
  );
}
