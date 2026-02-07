import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import './UserMenu.css';

function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate('/');
  }

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu__trigger" onClick={() => setOpen(!open)}>
        <div className="user-menu__avatar">{initial}</div>
        <span className="user-menu__name">{displayName}</span>
        <FiChevronDown
          size={16}
          className={`user-menu__chevron ${open ? 'user-menu__chevron--open' : ''}`}
        />
      </button>

      {open && (
        <div className="user-menu__dropdown">
          <div className="user-menu__info">
            <span className="user-menu__info-name">{displayName}</span>
            <span className="user-menu__info-email">{currentUser?.email}</span>
          </div>
          <div className="user-menu__divider" />
          <Link
            to="/profile"
            className="user-menu__item"
            onClick={() => setOpen(false)}
          >
            <FiUser size={16} />
            Profile & Progress
          </Link>
          <button className="user-menu__item user-menu__item--danger" onClick={handleLogout}>
            <FiLogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
