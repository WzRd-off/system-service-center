import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <h2>404</h2>
      <p>Сторінку не знайдено</p>
      <Link to={ROUTES.HOME}>На головну</Link>
    </div>
  );
}
