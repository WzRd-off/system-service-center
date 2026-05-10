import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  CheckCircle2,
  UserPlus,
  RefreshCw,
  HelpCircle,
  Wrench,
  XCircle,
  Bell
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../constants/roles.js';

const TYPE_META = {
  request_created: { icon: Plus, label: 'Заявку створено' },
  request_accepted: { icon: CheckCircle2, label: 'Заявку прийнято в обробку' },
  technician_assigned: { icon: UserPlus, label: 'Призначено майстра' },
  status_changed: { icon: RefreshCw, label: 'Змінено статус замовлення' },
  clarification_needed: { icon: HelpCircle, label: 'Потрібне уточнення' },
  repair_completed: { icon: Wrench, label: 'Ремонт завершено' },
  request_cancelled: { icon: XCircle, label: 'Замовлення скасовано' }
};

const requestUrlForRole = (role, requestId) => {
  if (!requestId) return null;
  switch (role) {
    case ROLES.CLIENT:
      return `/client/requests/${requestId}`;
    case ROLES.BUSINESS_CLIENT:
      return `/business/history/${requestId}`;
    case ROLES.MANAGER:
      return `/manager/requests/${requestId}`;
    case ROLES.TECHNICIAN:
      return `/master/requests/${requestId}`;
    default:
      return null;
  }
};

export function NotificationList({ items, onRead, onRemove }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return <p className="notifications-empty">Сповіщень немає</p>;

  const handleOpen = async (n) => {
    const url = requestUrlForRole(user?.role, n.request_id);
    if (!n.is_read) {
      try { await onRead?.(n.id); } catch { /* ignore */ }
    }
    if (url) navigate(url);
  };

  return (
    <ul className="notifications">
      {list.map((n) => {
        const meta = TYPE_META[n.type] || { icon: Bell, label: n.type_label || 'Сповіщення' };
        const Icon = meta.icon;
        const url = requestUrlForRole(user?.role, n.request_id);
        return (
          <li key={n.id} className={`notification-item ${n.is_read ? 'read' : 'unread'}`}>
            <span className="notification-item__icon" aria-hidden="true">
              <Icon size={18} />
            </span>
            <div className="notification-item__body">
              <div className="notification-item__title">{n.type_label || meta.label}</div>
              {url ? (
                <Link
                  to={url}
                  className="notification-item__message"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpen(n);
                  }}
                >
                  {n.message}
                </Link>
              ) : (
                <p className="notification-item__message">{n.message}</p>
              )}
              <small className="notification-item__time">{formatDateTime(n.created_at)}</small>
            </div>
            <div className="notification-item__actions">
              {!n.is_read && (
                <button type="button" onClick={() => onRead?.(n.id)}>Прочитано</button>
              )}
              <button type="button" onClick={() => onRemove?.(n.id)}>Видалити</button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
