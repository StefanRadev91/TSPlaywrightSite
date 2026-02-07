import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo/Logo';
import UserMenu from '../UserMenu/UserMenu';
import { FiMenu, FiX, FiLogIn, FiUserPlus } from 'react-icons/fi';
import './Header.css';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/playwright', label: 'Playwright' },
  { path: '/typescript', label: 'TypeScript' },
  { path: '/pom', label: 'Page Object Model' },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, loading } = useAuth();

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="header__logo" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}>
          {navItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}

          {/* Mobile-only auth links */}
          {!loading && !currentUser && (
            <div className="header__mobile-auth">
              <Link to="/login" className="header__link" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="header__link" onClick={() => setMobileOpen(false)}>
                Create Account
              </Link>
            </div>
          )}
        </nav>

        <div className="header__actions">
          {!loading && (
            currentUser ? (
              <UserMenu />
            ) : (
              <div className="header__auth">
                <Link to="/login" className="header__auth-btn header__auth-btn--login">
                  <FiLogIn size={16} />
                  Sign In
                </Link>
                <Link to="/register" className="header__auth-btn header__auth-btn--register">
                  <FiUserPlus size={16} />
                  Register
                </Link>
              </div>
            )
          )}

          <button
            className="header__burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
