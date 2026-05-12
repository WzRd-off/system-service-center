import { Link } from 'react-router-dom';
import { DeviceForm } from './DeviceForm.jsx';
import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';
import { Spinner } from '../common/Spinner.jsx';
import { ErrorMessage } from '../common/ErrorMessage.jsx';
import { PaginationBar, PAGE_SIZE } from '../common/PaginationBar.jsx';
import { useManagedDevicesPage } from '../../hooks/useManagedDevicesPage.js';

/**
 * Спільна розмітка сторінки «створити / список техніки» для клієнта та бізнесу.
 */
export function ManagedDevicesPageContent({
  title,
  getHistoryPath,
  data,
  loading,
  error,
  reload,
}) {
  const {
    activeTab,
    setActiveTab,
    listError,
    removingId,
    search,
    setSearch,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    page,
    setPage,
    addDevice,
    handleDeleteDevice,
    visibleDevices,
    pagedDevices,
    sortFieldOptions,
    sortDirectionOptions,
  } = useManagedDevicesPage(data, reload);

  return (
    <div className="canvas-stack">
      <section className="canvas-card canvas-card--compact">
        <h2>{title}</h2>
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
                  options={sortFieldOptions}
                />
                <Select
                  label="Напрям"
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  options={sortDirectionOptions}
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
                              to={getHistoryPath(d.id)}
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
  );
}
