import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../constants/roles.js';
import { ROUTES } from '../../constants/routes.js';

const PROFILE_ITEM = { to: ROUTES.PROFILE, label: 'Профіль' };

const MENU = {
  [ROLES.CLIENT]: [
    { to: ROUTES.CLIENT.DASHBOARD, label: 'Кабінет' },
    { to: ROUTES.CLIENT.NEW_REQUEST, label: 'Нова заявка' },
    { to: ROUTES.CLIENT.REQUESTS, label: 'Мої заявки' },
    { to: ROUTES.CLIENT.HISTORY, label: 'Історія' },
    PROFILE_ITEM,
  ],
  [ROLES.MANAGER]: [
    { to: ROUTES.MANAGER.DASHBOARD, label: 'Кабінет' },
    { to: ROUTES.MANAGER.REQUESTS, label: 'Заявки' },
    { to: ROUTES.MANAGER.BUSINESS_CLIENTS, label: 'Бізнес-клієнти' },
    { to: ROUTES.MANAGER.ANALYTICS, label: 'Аналітика' },
    PROFILE_ITEM,
  ],
  [ROLES.TECHNICIAN]: [
    { to: ROUTES.MASTER.DASHBOARD, label: 'Кабінет' },
    { to: ROUTES.MASTER.REQUESTS, label: 'Призначені заявки' },
    PROFILE_ITEM,
  ],
  [ROLES.BUSINESS_CLIENT]: [
    { to: ROUTES.BUSINESS.DASHBOARD, label: 'Кабінет' },
    { to: ROUTES.BUSINESS.PROFILE, label: 'Профіль компанії' },
    { to: ROUTES.BUSINESS.DEVICES, label: 'Техніка' },
    { to: ROUTES.BUSINESS.NEW_REQUEST, label: 'Нова заявка' },
    { to: ROUTES.BUSINESS.HISTORY, label: 'Історія' },
    { to: ROUTES.BUSINESS.MAINTENANCE, label: 'Планове обслуговування' },
    PROFILE_ITEM,
  ],
};

export function Sidebar() {
  const { user } = useAuth();
  const items = (user && MENU[user.role]) || [];

  return (
    <nav className="sidebar">
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to}>{item.label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
