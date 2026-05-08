import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';

export function Layout({ children }) {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  return (
    <div className={`app-layout ${navOpen ? 'app-layout--nav-open' : ''}`}>
      <Header navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />
      <div className="app-body">
        <Sidebar isOpen={navOpen} onNavigate={() => setNavOpen(false)} />
        {navOpen && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Закрити меню"
            onClick={() => setNavOpen(false)}
          />
        )}
        <main className="app-main">
          <div className="canvas-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
