import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { DeviceForm } from '../../components/equipment/DeviceForm.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Select } from '../../components/common/Select.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { PaginationBar, PAGE_SIZE } from '../../components/common/PaginationBar.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { equipmentApi } from '../../api/equipment.api.js';

const historyPath = (deviceId) => `/client/devices/${deviceId}/history`;

export function ClientDevicesPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(
    () => (user?.id ? equipmentApi.listByClient(user.id) : Promise.resolve([])),
    [user?.id]
  );
  const [activeTab, setActiveTab] = useState('create');
  const [listError, setListError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('type');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);

  const addDevice = async (form) => {
    await equipmentApi.create(form);
    reload();
    setActiveTab('list');
  };

  const handleDeleteDevice = async (device) => {
    const label = `${device.type || ''} ${device.manufacturer || ''} ${device.model || ''}`.trim() || 'пристрій';
    if (!window.confirm(`Видалити техніку «${label}»?`)) return;

    setListError(null);
    setRemovingId(device.id);
    try {
      await equipmentApi.delete(device.id);
      reload();
    } catch (err) {
      setListError(err?.message || 'Не вдалось видалити');
    } finally {
      setRemovingId(null);
    }
  };

  const visibleDevices = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const query = search.trim().toLowerCase();

    const filtered = query
      ? list.filter((d) =>
          [d.type, d.manufacturer, d.model, d.serial_number, d.notes]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        )
      : list;

    return [...filtered].sort((a, b) => {
      const left = String(a?.[sortField] ?? '');
      const right = String(b?.[sortField] ?? '');
      const cmp = left.localeCompare(right, 'uk', { sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, search, sortField, sortDirection]);

  useEffect(() => {
    setPage(0);
  }, [search, sortField, sortDirection]);

  const pagedDevices = useMemo(() => {
    const start = page * PAGE_SIZE;
    return visibleDevices.slice(start, start + PAGE_SIZE);
  }, [visibleDevices, page]);

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <h2>Моя техніка</h2>
          <div className="tabs">
            <button
              type="button"
              className={activeTab === 'create' ? 'active' : ''}
              onClick={() => setActiveTab('create')}
            >
              Створити техніку
            </button>
            <button
              type="button"
              className={activeTab === 'list' ? 'active' : ''}
              onClick={() => setActiveTab('list')}
            >
              Список техніки
            </button>
          </div>
        </section>

        {activeTab === 'create' && (
          <section className="canvas-card">
            <DeviceForm onSubmit={addDevice} />
          </section>
        )}

        {activeTab === 'list' && (
          <section className="canvas-card">
            <h3>Список техніки</h3>
            <ErrorMessage error={listError} />

            {loading ? (
              <Spinner />
            ) : error ? (
              <ErrorMessage error={error} />
            ) : !data?.length ? (
              <p>Техніки не додано</p>
            ) : (
              <>
                <div className="request-filters canvas-filters">
                  <Input
                    label="Пошук"
                    placeholder="Тип, виробник, модель, серійний номер..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Select
                    label="Сортувати за"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    options={[
                      { value: 'type', label: 'Тип' },
                      { value: 'manufacturer', label: 'Виробник' },
                      { value: 'model', label: 'Модель' },
                      { value: 'serial_number', label: 'Серійний номер' },
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
                        <th>Тип</th>
                        <th>Виробник</th>
                        <th>Модель</th>
                        <th>Серійний номер</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedDevices.map((d) => (
                        <tr key={d.id}>
                          <td>{d.type || '—'}</td>
                          <td>{d.manufacturer || '—'}</td>
                          <td>{d.model || '—'}</td>
                          <td>{d.serial_number || '—'}</td>
                          <td>
                            <div className="data-table-actions">
                              <Link
                                to={historyPath(d.id)}
                                className="btn btn-outline btn-sm"
                              >
                                Історія заявок
                              </Link>
                              <Button
                                type="button"
                                size="sm"
                                variant="danger"
                                loading={removingId === d.id}
                                onClick={() => handleDeleteDevice(d)}
                              >
                                Видалити
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!visibleDevices.length && <p>За вашим запитом нічого не знайдено</p>}
                <PaginationBar
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={visibleDevices.length}
                  onPageChange={setPage}
                />
              </>
            )}
          </section>
        )}
      </div>
    </Layout>
  );
}
