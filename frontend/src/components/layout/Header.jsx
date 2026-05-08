import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../common/Button.jsx';
import { NotificationList } from '../notifications/NotificationList.jsx';
import { notificationsApi } from '../../api/notifications.api.js';
import { ROUTES } from '../../constants/routes.js';

export function Header({ navOpen = false, onToggleNav }) {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  const load = async () => {
    try {
      const data = await notificationsApi.list();
      setItems(data || []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    if (!user) return undefined;
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [user]);

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
    load();
  };
  const onRemove = async (id) => {
    await notificationsApi.remove(id);
    load();
  };

  const unread = items.filter((n) => !n.is_read).length;

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
          <span className="app-brand__mark" aria-hidden="true">SC</span>
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
              <span aria-hidden="true">🔔</span>
              {unread > 0 && <span className="notifications-badge">{unread}</span>}
            </button>
            {open && (
              <div className="notifications-panel">
                <header className="notifications-panel__header">
                  <strong>Сповіщення</strong>
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
