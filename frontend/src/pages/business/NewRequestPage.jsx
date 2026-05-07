import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { RequestForm } from '../../components/requests/RequestForm.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { requestsApi } from '../../api/requests.api.js';
import { businessClientsApi } from '../../api/businessClients.api.js';
import { ROUTES } from '../../constants/routes.js';

export function BusinessNewRequestPage() {
  const navigate = useNavigate();
  const devices = useFetch(() => businessClientsApi.getDevices());
  const profile = useFetch(() => businessClientsApi.getProfile());

  const handleSubmit = async (data) => {
    await requestsApi.create(data);
    navigate(ROUTES.BUSINESS.HISTORY);
  };

  return (
    <Layout>
      <h2>Нова заявка</h2>
      {devices.loading || profile.loading ? (
        <Spinner />
      ) : (
        <RequestForm
          onSubmit={handleSubmit}
          businessFields
          devices={devices.data || []}
          businessContactPerson={profile.data?.contact_person}
        />
      )}
    </Layout>
  );
}
