import { Layout } from '../../components/layout/Layout.jsx';
import { DeviceList } from '../../components/equipment/DeviceList.jsx';
import { DeviceForm } from '../../components/equipment/DeviceForm.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';
import { equipmentApi } from '../../api/equipment.api.js';

export function CompanyDevicesPage() {
  const { data, loading, error, reload } = useFetch(() => businessClientsApi.getDevices());

  const addDevice = async (form) => {
    await equipmentApi.create(form);
    reload();
  };

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2>Техніка компанії</h2>
        </section>
        <section className="canvas-card">
          <DeviceForm onSubmit={addDevice} />
        </section>
        <section className="canvas-card">
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <DeviceList devices={data} />
          )}
        </section>
      </div>
    </Layout>
  );
}
