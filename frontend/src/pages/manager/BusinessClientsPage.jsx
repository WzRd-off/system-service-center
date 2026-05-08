  import { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Select } from '../../components/common/Select.jsx';
import { DeviceList } from '../../components/equipment/DeviceList.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';

export function BusinessClientsPage() {
  const clients = useFetch(() => businessClientsApi.list(), []);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('company_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const devices = useFetch(
    () => (selectedId ? businessClientsApi.getDevicesById(selectedId) : Promise.resolve([])),
    [selectedId]
  );

  const visibleClients = useMemo(() => {
    const list = Array.isArray(clients.data) ? clients.data : [];
    const query = search.trim().toLowerCase();

    const filtered = query
      ? list.filter((c) =>
          [
            c.company_name,
            c.edrpou,
            c.contact_person,
            c.phone,
            c.email,
            c.address,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        )
      : list;

    return [...filtered].sort((a, b) => {
      let left = a?.[sortField];
      let right = b?.[sortField];
      if (sortField === 'total_requests') {
        left = Number(left || 0);
        right = Number(right || 0);
        return sortDirection === 'asc' ? left - right : right - left;
      }

      const cmp = String(left || '').localeCompare(String(right || ''), 'uk', { sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [clients.data, search, sortField, sortDirection]);

  const selected = clients.data?.find((c) => c.id === selectedId);

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2>Бізнес-клієнти</h2>
        </section>
        <section className="canvas-card">
          {clients.loading ? (
            <Spinner />
          ) : !clients.data?.length ? (
            <p>Бізнес-клієнтів немає</p>
          ) : (
            <>
              <div className="request-filters canvas-filters">
                <Input
                  label="Пошук"
                  placeholder="Компанія, ЄДРПОУ, контакт, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                  label="Сортувати за"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  options={[
                    { value: 'company_name', label: 'Компанія' },
                    { value: 'contact_person', label: 'Контактна особа' },
                    { value: 'total_requests', label: 'Кількість заявок' },
                  ]}
                />
                <Select
                  label="Напрям"
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  options={[
                    { value: 'asc', label: 'За зростанням' },
                    { value: 'desc', label: 'За спаданням' },
                  ]}
                />
              </div>

              <div className="table-wrap">
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
                    {visibleClients.map((c) => (
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
              </div>
              {!visibleClients.length && <p>За вашим запитом нічого не знайдено</p>}
            </>
          )}
        </section>
      </div>

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
