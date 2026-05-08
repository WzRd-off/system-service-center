import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout.jsx';
import { ROUTES } from '../../constants/routes.js';

export function ClientDashboard() {
  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card">
          <h2>Кабінет клієнта</h2>
          <p className="hint">Керуйте заявками, переглядайте поточний стан та історію звернень.</p>
        </section>
        <div className="canvas-grid">
          <Link to={ROUTES.CLIENT.NEW_REQUEST} className="action-tile">
            <span className="action-tile-icon">📝</span>
            <h3 className="action-tile-title">Створити заявку</h3>
            <p className="action-tile-text">Оформіть нове звернення до сервісного центру.</p>
            <div className="action-tile-footer"><span className="btn btn-outline btn-sm">Відкрити</span></div>
          </Link>
          <Link to={ROUTES.CLIENT.REQUESTS} className="action-tile">
            <span className="action-tile-icon">📦</span>
            <h3 className="action-tile-title">Мої заявки</h3>
            <p className="action-tile-text">Перегляньте активні заявки та їхні статуси.</p>
            <div className="action-tile-footer"><span className="btn btn-outline btn-sm">Перейти</span></div>
          </Link>
          <Link to={ROUTES.CLIENT.HISTORY} className="action-tile">
            <span className="action-tile-icon">🕘</span>
            <h3 className="action-tile-title">Історія</h3>
            <p className="action-tile-text">Доступ до завершених і попередніх звернень.</p>
            <div className="action-tile-footer"><span className="btn btn-outline btn-sm">Переглянути</span></div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
