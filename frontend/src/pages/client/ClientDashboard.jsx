import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { ROUTES } from '../../constants/routes.js';

export function ClientDashboard() {
  return (
    <Layout>
      <h2>Кабінет клієнта</h2>
      <div className="dashboard-tiles">
        <Link to={ROUTES.CLIENT.NEW_REQUEST}>Створити заявку</Link>
        <Link to={ROUTES.CLIENT.REQUESTS}>Мої заявки</Link>
        <Link to={ROUTES.CLIENT.HISTORY}>Історія</Link>
      </div>
    </Layout>
  );
}
