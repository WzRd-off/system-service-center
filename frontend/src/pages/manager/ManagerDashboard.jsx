import { Link } from 'react-router-dom';
import { BarChart3, Building2, List, Wrench } from 'lucide-react';
import { Layout } from '../../components/layout/Layout.jsx';
import { ROUTES } from '../../constants/routes.js';

export function ManagerDashboard() {
  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card">
          <h2>Кабінет менеджера</h2>
          <p className="hint">Координуйте обробку заявок, майстрів і бізнес-клієнтів в єдиному просторі.</p>
        </section>
        <div className="canvas-grid">
          <Link to={ROUTES.MANAGER.REQUESTS} className="action-tile">
            <span className="action-tile-icon">
              <List color="#0066cc" size={32} />
            </span>
            <h3 className="action-tile-title">Заявки</h3>
            <p className="action-tile-text">Контроль усіх запитів і призначень.</p>
            <div className="action-tile-footer">
              <span className="btn btn-outline btn-sm">Відкрити</span>
            </div>
          </Link>
          <Link to={ROUTES.MANAGER.BUSINESS_CLIENTS} className="action-tile">
            <span className="action-tile-icon">
              <Building2 color="#0066cc" size={32} />
            </span>
            <h3 className="action-tile-title">Бізнес-клієнти</h3>
            <p className="action-tile-text">Перегляд компаній, контактів і їх техніки.</p>
            <div className="action-tile-footer">
              <span className="btn btn-outline btn-sm">Перейти</span>
            </div>
          </Link>
          <Link to={ROUTES.MANAGER.MASTERS} className="action-tile">
            <span className="action-tile-icon">
              <Wrench color="#0066cc" size={32} />
            </span>
            <h3 className="action-tile-title">Майстри</h3>
            <p className="action-tile-text">Реєстрація та адміністрування майстрів.</p>
            <div className="action-tile-footer">
              <span className="btn btn-outline btn-sm">Керувати</span>
            </div>
          </Link>
          <Link to={ROUTES.MANAGER.ANALYTICS} className="action-tile">
            <span className="action-tile-icon">
              <BarChart3 color="#0066cc" size={32} />
            </span>
            <h3 className="action-tile-title">Аналітика</h3>
            <p className="action-tile-text">Зведення по статусах і активності.</p>
            <div className="action-tile-footer">
              <span className="btn btn-outline btn-sm">Дивитись</span>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
