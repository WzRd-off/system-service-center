import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { ROUTES } from '../../constants/routes.js';

export function ManagerDashboard() {
  return (
    <Layout>
      <h2>Кабінет менеджера</h2>
      <div className="dashboard-tiles">
        <Link to={ROUTES.MANAGER.REQUESTS}>Заявки</Link>
        <Link to={ROUTES.MANAGER.BUSINESS_CLIENTS}>Бізнес-клієнти</Link>
        <Link to={ROUTES.MANAGER.MASTERS}>Майстри</Link>
        <Link to={ROUTES.MANAGER.ANALYTICS}>Аналітика</Link>
      </div>
    </Layout>
  );
}
