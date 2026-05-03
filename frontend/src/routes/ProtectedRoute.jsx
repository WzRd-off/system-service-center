import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/routes.js';

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Завантаження...</div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={ROUTES.HOME} replace />;

  return children;
}
