import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../common/Button.jsx';
import { NotificationList } from '../notifications/NotificationList.jsx';
import { Bell } from 'lucide-react';
import { notificationsApi } from '../../api/notifications.api.js';
import { ROUTES } from '../../constants/routes.js';

const POPOVER_LIMIT = 8;

export function Header({ navOpen = false, onToggleNav }) {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  const loadCount = useCallback(async () => {
    try {
      const data = await notificationsApi.unreadCount();
      setUnread(Number(data?.count) || 0);
    } catch {
      setUnread(0);
    }
  }, []);

  const loadList = useCallback(async () => {
    try {
      const data = await notificationsApi.list({ limit: POPOVER_LIMIT });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      setItems([]);
      return undefined;
    }
    loadCount();
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, [user, loadCount]);

  useEffect(() => {
    if (!open) return;
    loadList();
  }, [open, loadList]);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const onRead = async (id) => {
    await notificationsApi.markAsRead(id);
    await Promise.all([loadList(), loadCount()]);
  };

  const onRemove = async (id) => {
    await notificationsApi.remove(id);
    await Promise.all([loadList(), loadCount()]);
  };

  const onReadAll = async () => {
    await notificationsApi.markAllRead();
    await Promise.all([loadList(), loadCount()]);
  };

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <button
          type="button"
          className={`app-nav-toggle ${navOpen ? 'is-open' : ''}`}
          aria-label="Меню"
          aria-expanded={navOpen}
          onClick={onToggleNav}
        >
          <span />
          <span />
          <span />
        </button>
        <Link to={ROUTES.HOME} className="app-brand">
          <span>
            <strong>Сервісний центр</strong>
            <small>System Service Center</small>
          </span>
        </Link>
      </div>
      {user && (
        <div className="user-info">
          <div className="notifications-popover" ref={popoverRef}>
            <button
              type="button"
              className="notifications-bell"
              onClick={() => setOpen((v) => !v)}
              aria-label="Сповіщення"
            >
              <Bell size={20} className="notifications-bell__icon" color="#e2f207" strokeWidth={2.2} />
              {unread > 0 && <span className="notifications-badge">{unread}</span>}
            </button>
            {open && (
              <div className="notifications-panel">
                <header className="notifications-panel__header">
                  <strong>Сповіщення</strong>
                  <div className="notifications-panel__actions">
                    {unread > 0 && (
                      <button
                        type="button"
                        className="notifications-panel__action"
                        onClick={onReadAll}
                      >
                        Прочитати всі
                      </button>
                    )}
                    <Link
                      to={ROUTES.NOTIFICATIONS}
                      className="notifications-panel__action"
                      onClick={() => setOpen(false)}
                    >
                      Усі сповіщення
                    </Link>
                  </div>
                </header>
                <NotificationList items={items} onRead={onRead} onRemove={onRemove} />
              </div>
            )}
          </div>
          <Link to={ROUTES.PROFILE} className="user-info__profile">
            <span>{user.email}</span>
            <small>{user.role}</small>
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>Вийти</Button>
        </div>
      )}
    </header>
  );
}
