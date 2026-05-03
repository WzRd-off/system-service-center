import { Layout } from '../../components/layout/Layout.jsx';
import { DeviceList } from '../../components/equipment/DeviceList.jsx';
import { DeviceForm } from '../../components/equipment/DeviceForm.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';
import { equipmentApi } from '../../api/equipment.api.js';

export function CompanyDevicesPage() {
  const { data, loading, reload } = useFetch(() => businessClientsApi.getDevices());

  const addDevice = async (form) => {
    await equipmentApi.create(form);
    reload();
  };

  return (
    <Layout>
      <h2>Техніка компанії</h2>
      <DeviceForm onSubmit={addDevice} />
      {loading ? <Spinner /> : <DeviceList devices={data} />}
    </Layout>
  );
}
