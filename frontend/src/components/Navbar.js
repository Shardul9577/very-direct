import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { INSTAGRAM_URL } from '../constants/brand';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/videos', label: 'Videos' },
    { to: '/blogs', label: 'Blogs' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="Very Direct home">
          <span className="navbar-brand__frame">
            <Logo size="nav" variant="header" />
          </span>
        </Link>

        <nav className="navbar-nav" aria-label="Main navigation">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${pathname === to ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="navbar-end">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-cta"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </header>
  );
}
