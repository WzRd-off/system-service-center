import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { ROUTES } from '../../constants/routes.js';

export function BusinessDashboard() {
  return (
    <Layout>
      <h2>Кабінет бізнес-клієнта</h2>
      <div className="dashboard-tiles">
        <Link to={ROUTES.BUSINESS.PROFILE}>Профіль компанії</Link>
        <Link to={ROUTES.BUSINESS.DEVICES}>Техніка</Link>
        <Link to={ROUTES.BUSINESS.NEW_REQUEST}>Нова заявка</Link>
        <Link to={ROUTES.BUSINESS.HISTORY}>Історія</Link>
        <Link to={ROUTES.BUSINESS.MAINTENANCE}>Планове обслуговування</Link>
      </div>
    </Layout>
  );
}
