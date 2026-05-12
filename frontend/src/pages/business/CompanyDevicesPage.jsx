import { Layout } from '../../components/layout/Layout.jsx';
import { ManagedDevicesPageContent } from '../../components/equipment/ManagedDevicesPageContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';

export function CompanyDevicesPage() {
  const { data, loading, error, reload } = useFetch(() => businessClientsApi.getDevices());

  return (
    <Layout>
      <ManagedDevicesPageContent
        title="Техніка компанії"
        getHistoryPath={(deviceId) => `/business/devices/${deviceId}/history`}
        data={data}
        loading={loading}
        error={error}
        reload={reload}
      />
    </Layout>
  );
}
