import { Link } from 'react-router-dom';
import { Building2, ClipboardList, FolderOpen, Laptop, Wrench } from 'lucide-react';
import { Layout } from '../../components/layout/Layout.jsx';
import { ROUTES } from '../../constants/routes.js';

export function BusinessDashboard() {
  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card">
          <h2>Кабінет бізнес-клієнта</h2>
          <p className="hint">Керуйте профілем компанії, технікою та сервісними запитами.</p>
        </section>
        <div className="canvas-grid">
          <Link to={ROUTES.BUSINESS.PROFILE} className="action-tile">
            <span className="action-tile-icon">
              <Building2 color="#0066cc" size={32} />
            </span>
            <h3 className="action-tile-title">Профіль компанії</h3>
            <p className="action-tile-text">Контакти та реквізити компанії.</p>
            <div className="action-tile-footer">
              <span className="btn btn-outline btn-sm">Відкрити</span>
            </div>
          </Link>
          <Link to={ROUTES.BUSINESS.DEVICES} className="action-tile">
            <span className="action-tile-icon">
              <Laptop color="#0066cc" size={32} />
            </span>
            <h3 className="action-tile-title">Техніка</h3>
            <p className="action-tile-text">Список обладнання, що обслуговується.</p>
            <div className="action-tile-footer">
              <span className="btn btn-outline btn-sm">Перейти</span>
            </div>
          </Link>
          <Link to={ROUTES.BUSINESS.NEW_REQUEST} className="action-tile">
            <span className="action-tile-icon">
              <ClipboardList color="#0066cc" size={32} />
            </span>
            <h3 className="action-tile-title">Нова заявка</h3>
            <p className="action-tile-text">Створення нового сервісного запиту.</p>
            <div className="action-tile-footer">
              <span className="btn btn-outline btn-sm">Створити</span>
            </div>
          </Link>
          <Link to={ROUTES.BUSINESS.HISTORY} className="action-tile">
            <span className="action-tile-icon">
              <FolderOpen color="#0066cc" size={32} />
            </span>
            <h3 className="action-tile-title">Історія</h3>
            <p className="action-tile-text">Архів усіх оброблених звернень.</p>
            <div className="action-tile-footer">
              <span className="btn btn-outline btn-sm">Переглянути</span>
            </div>
          </Link>
          <Link to={ROUTES.BUSINESS.MAINTENANCE} className="action-tile">
            <span className="action-tile-icon">
              <Wrench color="#0066cc" size={32} />
            </span>
            <h3 className="action-tile-title">Планове обслуговування</h3>
            <p className="action-tile-text">Плани регулярного сервісу техніки.</p>
            <div className="action-tile-footer">
              <span className="btn btn-outline btn-sm">Керувати</span>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
