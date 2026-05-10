import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/routes.js';

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const normalizeRole = (role) =>
    String(role || '')
      .toLowerCase()
      .replace(/['’`]/g, '')
      .replace(/[\s_-]+/g, '');

  if (loading) return <div>Завантаження...</div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (roles && !roles.map(normalizeRole).includes(normalizeRole(user.role))) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
