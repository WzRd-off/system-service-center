import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { ROUTES } from '../../constants/routes.js';

export function MasterDashboard() {
  return (
    <Layout>
      <h2>Кабінет майстра</h2>
      <div className="dashboard-tiles">
        <Link to={ROUTES.MASTER.REQUESTS}>Призначені заявки</Link>
      </div>
    </Layout>
  );
}
