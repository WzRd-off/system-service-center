import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../constants/roles.js';
import { ROUTES } from '../../constants/routes.js';

const PROFILE_ITEM = { to: ROUTES.PROFILE, label: 'Профіль' };

const MENU = {
  [ROLES.CLIENT]: [
    { to: ROUTES.CLIENT.DASHBOARD, label: 'Кабінет', icon: '⌂' },
    { to: ROUTES.CLIENT.NEW_REQUEST, label: 'Нова заявка', icon: '+' },
    { to: ROUTES.CLIENT.REQUESTS, label: 'Мої заявки', icon: '□' },
    { to: ROUTES.CLIENT.HISTORY, label: 'Історія', icon: '↺' },
    PROFILE_ITEM,
  ],
  [ROLES.MANAGER]: [
    { to: ROUTES.MANAGER.DASHBOARD, label: 'Кабінет', icon: '⌂' },
    { to: ROUTES.MANAGER.REQUESTS, label: 'Заявки', icon: '□' },
    { to: ROUTES.MANAGER.BUSINESS_CLIENTS, label: 'Бізнес-клієнти', icon: '◇' },
    { to: ROUTES.MANAGER.MASTERS, label: 'Майстри', icon: '⚙' },
    { to: ROUTES.MANAGER.ANALYTICS, label: 'Аналітика', icon: '↗' },
    PROFILE_ITEM,
  ],
  [ROLES.TECHNICIAN]: [
    { to: ROUTES.MASTER.DASHBOARD, label: 'Кабінет', icon: '⌂' },
    { to: ROUTES.MASTER.REQUESTS, label: 'Призначені заявки', icon: '□' },
    PROFILE_ITEM,
  ],
  [ROLES.BUSINESS_CLIENT]: [
    { to: ROUTES.BUSINESS.DASHBOARD, label: 'Кабінет', icon: '⌂' },
    { to: ROUTES.BUSINESS.PROFILE, label: 'Профіль компанії', icon: '◇' },
    { to: ROUTES.BUSINESS.DEVICES, label: 'Техніка', icon: '▣' },
    { to: ROUTES.BUSINESS.NEW_REQUEST, label: 'Нова заявка', icon: '+' },
    { to: ROUTES.BUSINESS.HISTORY, label: 'Історія', icon: '↺' },
    { to: ROUTES.BUSINESS.MAINTENANCE, label: 'Планове обслуговування', icon: '✓' },
    PROFILE_ITEM,
  ],
};

export function Sidebar({ isOpen = false, onNavigate }) {
  const { user } = useAuth();
  const items = ((user && MENU[user.role]) || []).map((item) => ({
    icon: '•',
    ...item,
  }));

  return (
    <nav className={`sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Основна навігація">
      <div className="sidebar__header">
        <span className="sidebar__eyebrow">Навігація</span>
        {user && <strong>{user.role}</strong>}
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} onClick={onNavigate}>
              <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
