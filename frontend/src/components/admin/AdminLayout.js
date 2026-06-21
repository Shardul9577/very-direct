import { useEffect } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { to: '/admin/videos', label: 'Videos', icon: '▶' },
  { to: '/admin/blogs', label: 'Blogs', icon: '✎' },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => document.body.classList.remove('admin-body');
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;
  if (!admin) return <Navigate to="/abhaypratap" replace />;

  const handleLogout = () => {
    logout();
    navigate('/abhaypratap');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Logo size="sm" className="admin-sidebar__logo-img" />
          <span className="admin-sidebar__panel-label">Admin Panel</span>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? ' active' : ''}`
              }
            >
              <span className="admin-sidebar__icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <NavLink to="/" className="admin-sidebar__link admin-sidebar__link--muted">
            ← View Site
          </NavLink>
          <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar__eyebrow">Content Management</p>
            <p className="admin-topbar__user">Signed in as {admin.username}</p>
          </div>
        </header>
        <div className="admin-main__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
