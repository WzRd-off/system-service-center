import { useAuth } from '../../context/AuthContext.jsx';

export function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="app-header">
      <h1>Сервісний центр</h1>
      {user && (
        <div className="user-info">
          <span>{user.email} ({user.role})</span>
          <button onClick={logout}>Вийти</button>
        </div>
      )}
    </header>
  );
}
