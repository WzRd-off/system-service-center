import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { RequestForm } from '../../components/requests/RequestForm.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ClientUserSearch } from '../../components/manager/ClientUserSearch.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { equipmentApi } from '../../api/equipment.api.js';
import { requestsApi } from '../../api/requests.api.js';
import { ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/roles.js';

export function ManagerNewRequestPage() {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(null);

  const userId = selectedClient ? String(selectedClient.id) : '';
  const isBusiness = selectedClient?.role === ROLES.BUSINESS_CLIENT;

  const devices = useFetch(
    () =>
      userId && isBusiness
        ? equipmentApi.listByClient(Number(userId))
        : Promise.resolve([]),
    [userId, isBusiness]
  );

  const handleSubmit = async (data) => {
    if (!selectedClient) return;
    await requestsApi.create({ ...data, userId: selectedClient.id });
    navigate(ROUTES.MANAGER.REQUESTS);
  };

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2 className="page-title">Нова заявка для клієнта</h2>
          <p className="new-request-page-subtitle">
            Знайдіть клієнта пошуком (велика база) і заповніть заявку. Вона буде створена від його імені.
          </p>
        </section>
        <section className="canvas-card form-container">
          <div className="form-section">
            <ClientUserSearch
              selected={selectedClient}
              onSelect={setSelectedClient}
              onClear={() => setSelectedClient(null)}
            />
          </div>
          {selectedClient ? (
            devices.loading && isBusiness ? (
              <Spinner />
            ) : (
              <RequestForm
                onSubmit={handleSubmit}
                businessFields={isBusiness}
                devices={devices.data || []}
                businessContactPerson={selectedClient.contact_person}
              />
            )
          ) : (
            <p className="hint">Оберіть клієнта через пошук вище.</p>
          )}
        </section>
      </div>
    </Layout>
  );
}
