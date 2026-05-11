import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../constants/roles.js';
import { ROUTES } from '../../constants/routes.js';
import {
  BarChart3,
  Bell,
  Building2,
  Check,
  Circle,
  Grid3X3,
  History,
  Home,
  List,
  Plus,
  UserRound,
  Wrench,
} from 'lucide-react';

const PROFILE_ITEM = { to: ROUTES.PROFILE, label: 'Профіль', icon: 'building' };
const NOTIFICATIONS_ITEM = { to: ROUTES.NOTIFICATIONS, label: 'Сповіщення', icon: 'bell' };

const MENU = {
  [ROLES.CLIENT]: [
    { to: ROUTES.CLIENT.DASHBOARD, label: 'Кабінет', icon: 'home' },
    { to: ROUTES.CLIENT.NEW_REQUEST, label: 'Нова заявка', icon: 'plus' },
    { to: ROUTES.CLIENT.REQUESTS, label: 'Мої заявки', icon: 'square' },
    { to: ROUTES.CLIENT.DEVICES, label: 'Техніка', icon: 'grid' },
    { to: ROUTES.CLIENT.HISTORY, label: 'Історія', icon: 'history' },
    NOTIFICATIONS_ITEM,
    PROFILE_ITEM,
  ],
  [ROLES.MANAGER]: [
    { to: ROUTES.MANAGER.DASHBOARD, label: 'Кабінет', icon: 'home' },
    { to: ROUTES.MANAGER.NEW_REQUEST, label: 'Нова заявка', icon: 'plus' },
    { to: ROUTES.MANAGER.REQUESTS, label: 'Заявки', icon: 'square' },
    NOTIFICATIONS_ITEM,
    { to: ROUTES.MANAGER.BUSINESS_CLIENTS, label: 'Бізнес-клієнти', icon: 'diamond' },
    { to: ROUTES.MANAGER.MASTERS, label: 'Майстри', icon: 'settings' },
    { to: ROUTES.MANAGER.ANALYTICS, label: 'Аналітика', icon: 'chart' },
    PROFILE_ITEM,
  ],
  [ROLES.TECHNICIAN]: [
    { to: ROUTES.MASTER.DASHBOARD, label: 'Кабінет', icon: 'home' },
    { to: ROUTES.MASTER.REQUESTS, label: 'Призначені заявки', icon: 'square' },
    PROFILE_ITEM,
  ],
  [ROLES.BUSINESS_CLIENT]: [
    { to: ROUTES.BUSINESS.DASHBOARD, label: 'Кабінет', icon: 'home' },
    { to: ROUTES.BUSINESS.PROFILE, label: 'Профіль компанії', icon: 'diamond' },
    { to: ROUTES.BUSINESS.DEVICES, label: 'Техніка', icon: 'grid' },
    { to: ROUTES.BUSINESS.NEW_REQUEST, label: 'Нова заявка', icon: 'plus' },
    { to: ROUTES.BUSINESS.HISTORY, label: 'Історія', icon: 'history' },
    { to: ROUTES.BUSINESS.MAINTENANCE, label: 'Планове обслуговування', icon: 'check' },
    NOTIFICATIONS_ITEM,
    PROFILE_ITEM,
  ],
};

const ICONS = {
  home: Home,
  plus: Plus,
  square: List,
  history: History,
  diamond: Building2,
  settings: Wrench,
  chart: BarChart3,
  grid: Grid3X3,
  check: Check,
  building: UserRound,
  bell: Bell,
};

export function Sidebar({ isOpen = false, onNavigate }) {
  const { user } = useAuth();
  const items = (user && MENU[user.role]) || [];

  return (
    <nav className={`sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Основна навігація">
      <div className="sidebar__header">
        <span className="sidebar__eyebrow">Навігація</span>
        {user && <strong>{user.role}</strong>}
      </div>
      <ul>
        {items.map((item) => {
          const ItemIcon = ICONS[item.icon] || Circle;
          return (
          <li key={item.to}>
            <NavLink to={item.to} onClick={onNavigate}>
              <span className="sidebar__icon" aria-hidden="true"><ItemIcon size={18} /></span>
              <span>{item.label}</span>
            </NavLink>
          </li>
          );
        })}
      </ul>
    </nav>
  );
}
