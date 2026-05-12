import { Layout } from '../../components/layout/Layout.jsx';
import { ManagedDevicesPageContent } from '../../components/equipment/ManagedDevicesPageContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { equipmentApi } from '../../api/equipment.api.js';

export function ClientDevicesPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(
    () => (user?.id ? equipmentApi.listByClient(user.id) : Promise.resolve([])),
    [user?.id]
  );

  return (
    <Layout>
      <ManagedDevicesPageContent
        title="Моя техніка"
        getHistoryPath={(deviceId) => `/client/devices/${deviceId}/history`}
        data={data}
        loading={loading}
        error={error}
        reload={reload}
      />
    </Layout>
  );
}
