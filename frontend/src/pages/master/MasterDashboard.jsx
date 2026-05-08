import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { ROUTES } from '../../constants/routes.js';

export function MasterDashboard() {
  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card">
          <h2>Кабінет майстра</h2>
          <p className="hint">Переглядайте призначені задачі та ведіть супровід заявок.</p>
        </section>
        <div className="canvas-grid">
          <Link to={ROUTES.MASTER.REQUESTS} className="action-tile">
            <span className="action-tile-icon">🛠️</span>
            <h3 className="action-tile-title">Призначені заявки</h3>
            <p className="action-tile-text">Робочий список заявок, закріплених за вами.</p>
            <div className="action-tile-footer"><span className="btn btn-outline btn-sm">Перейти</span></div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
