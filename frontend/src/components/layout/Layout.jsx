import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';

export function Layout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
