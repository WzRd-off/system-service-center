import { useCallback, useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout.jsx';
import { NotificationList } from '../components/notifications/NotificationList.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { Button } from '../components/common/Button.jsx';
import { notificationsApi } from '../api/notifications.api.js';

const PAGE_SIZE = 20;

export function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, count] = await Promise.all([
        notificationsApi.list({
          unread: filter === 'unread',
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE
        }),
        notificationsApi.unreadCount()
      ]);
      setItems(Array.isArray(list) ? list : []);
      setUnread(Number(count?.count) || 0);
    } catch (err) {
      setError(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  const onRead = async (id) => {
    await notificationsApi.markAsRead(id);
    load();
  };
  const onRemove = async (id) => {
    await notificationsApi.remove(id);
    load();
  };
  const onReadAll = async () => {
    await notificationsApi.markAllRead();
    load();
  };

  const changeFilter = (next) => {
    setPage(0);
    setFilter(next);
  };

  const hasNext = items.length === PAGE_SIZE;
  const hasPrev = page > 0;

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
          <div className="notifications-page__head">
            <div>
              <h2>Сповіщення</h2>
              <p className="hint">Усі події по ваших заявках в одному місці.</p>
            </div>
            {unread > 0 && (
              <Button variant="outline" size="sm" onClick={onReadAll}>
                Прочитати всі ({unread})
              </Button>
            )}
          </div>
          <div className="notifications-page__filters">
            <button
              type="button"
              className={`tab ${filter === 'all' ? 'is-active' : ''}`}
              onClick={() => changeFilter('all')}
            >
              Усі
            </button>
            <button
              type="button"
              className={`tab ${filter === 'unread' ? 'is-active' : ''}`}
              onClick={() => changeFilter('unread')}
            >
              Непрочитані{unread > 0 ? ` (${unread})` : ''}
            </button>
          </div>
        </section>

        <section className="canvas-card">
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <>
              <NotificationList items={items} onRead={onRead} onRemove={onRemove} />
              {(hasPrev || hasNext) && (
                <div className="notifications-page__pagination">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!hasPrev}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Назад
                  </Button>
                  <span className="hint">Сторінка {page + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!hasNext}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Далі
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </Layout>
  );
}
