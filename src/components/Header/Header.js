import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo/Logo';
import UserMenu from '../UserMenu/UserMenu';
import { FiMenu, FiX, FiLogIn, FiUserPlus, FiChevronDown } from 'react-icons/fi';
import './Header.css';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/playwright', label: 'Playwright' },
  { path: '/typescript', label: 'TypeScript' },
  { path: '/pom', label: 'Page Object Model' },
];

const perfItems = [
  { path: '/k6', label: 'K6' },
  { path: '/postman', label: 'Postman' },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [perfOpen, setPerfOpen] = useState(false);
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const perfRef = useRef(null);

  const isPerfActive = perfItems.some(item => location.pathname === item.path);

  useEffect(() => {
    function handleClick(e) {
      if (perfRef.current && !perfRef.current.contains(e.target)) {
        setPerfOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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

          {/* Performance Testing dropdown */}
          <div className="header__dropdown" ref={perfRef}>
            <button
              className={`header__link header__dropdown-toggle ${isPerfActive ? 'header__link--active' : ''}`}
              onClick={() => setPerfOpen(!perfOpen)}
            >
              Performance Testing
              <FiChevronDown
                size={14}
                className={`header__dropdown-arrow ${perfOpen ? 'header__dropdown-arrow--open' : ''}`}
              />
            </button>
            {perfOpen && (
              <div className="header__dropdown-menu">
                {perfItems.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `header__dropdown-item ${isActive ? 'header__dropdown-item--active' : ''}`
                    }
                    onClick={() => { setPerfOpen(false); setMobileOpen(false); }}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

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
