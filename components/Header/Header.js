'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '../UserMenu/UserMenu';
import { FiMenu, FiX, FiLogIn, FiUserPlus, FiChevronDown } from 'react-icons/fi';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/playwright', label: 'Playwright' },
  { path: '/typescript', label: 'TypeScript' },
  { path: '/pom', label: 'Page Object Model' },
  { path: '/qa-ci', label: 'QA in CI/CD' },
  { path: '/ai-eval', label: 'AI Evaluation' },
];

const perfItems = [
  { path: '/k6', label: 'K6' },
  { path: '/postman', label: 'Postman' },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [perfOpen, setPerfOpen] = useState(false);
  const { currentUser, loading } = useAuth();
  const pathname = usePathname();
  const perfRef = useRef(null);

  const isPerfActive = perfItems.some(item => pathname === item.path);

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
        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}>
          {navItems.map(({ path, label }) => {
            const isActive = path === '/' ? pathname === '/' : pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className={`header__link ${isActive ? 'header__link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            );
          })}

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
                  <Link
                    key={path}
                    href={path}
                    className={`header__dropdown-item ${pathname === path ? 'header__dropdown-item--active' : ''}`}
                    onClick={() => { setPerfOpen(false); setMobileOpen(false); }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </nav>

        <div className="header__actions">
          {!loading && (
            currentUser ? (
              <UserMenu />
            ) : (
              <div className="header__auth">
                <Link href="/login" className="header__auth-btn header__auth-btn--login" onClick={() => setMobileOpen(false)}>
                  <FiLogIn size={16} />
                  Sign In
                </Link>
                <Link href="/register" className="header__auth-btn header__auth-btn--register" onClick={() => setMobileOpen(false)}>
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
