import { Layout } from '../../components/layout/Layout.jsx';
import { DeviceList } from '../../components/equipment/DeviceList.jsx';
import { DeviceForm } from '../../components/equipment/DeviceForm.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { equipmentApi } from '../../api/equipment.api.js';

export function ClientDevicesPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(
    () => (user?.id ? equipmentApi.listByClient(user.id) : Promise.resolve([])),
    [user?.id]
  );

  const addDevice = async (form) => {
    await equipmentApi.create(form);
    reload();
  };

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2>Моя техніка</h2>
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
            <DeviceList
              devices={data}
              getHistoryPath={(deviceId) => `/client/devices/${deviceId}/history`}
            />
          )}
        </section>
      </div>
    </Layout>
  );
}
