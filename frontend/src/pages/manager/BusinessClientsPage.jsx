import { useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Button } from '../../components/common/Button.jsx';
import { DeviceList } from '../../components/equipment/DeviceList.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';

export function BusinessClientsPage() {
  const clients = useFetch(() => businessClientsApi.list(), []);
  const [selectedId, setSelectedId] = useState(null);
  const devices = useFetch(
    () => (selectedId ? businessClientsApi.getDevicesById(selectedId) : Promise.resolve([])),
    [selectedId]
  );

  const selected = clients.data?.find((c) => c.id === selectedId);

  return (
    <Layout>
      <h2>Бізнес-клієнти</h2>
      {clients.loading ? (
        <Spinner />
      ) : !clients.data?.length ? (
        <p>Бізнес-клієнтів немає</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Компанія</th>
              <th>ЄДРПОУ</th>
              <th>Контактна особа</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Адреса</th>
              <th>Заявок</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.data.map((c) => (
              <tr key={c.id}>
                <td>{c.company_name}</td>
                <td>{c.edrpou || '—'}</td>
                <td>{c.contact_person || '—'}</td>
                <td>{c.phone || '—'}</td>
                <td>{c.email || '—'}</td>
                <td>{c.address || '—'}</td>
                <td>{c.total_requests ?? 0}</td>
                <td>
                  <Button size="sm" variant="outline" onClick={() => setSelectedId(c.id)}>
                    Техніка
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        title={selected ? `Техніка: ${selected.company_name}` : 'Техніка компанії'}
        size="lg"
      >
        {devices.loading ? <Spinner /> : <DeviceList devices={devices.data || []} />}
      </Modal>
    </Layout>
  );
}
