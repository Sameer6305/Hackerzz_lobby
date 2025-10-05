import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from './Img/logo.png';

export default function DashboardAppbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="dashboard-appbar">
      <div className="appbar-left">
        <img src={logoImg} alt="Logo" className="appbar-logo" />
        <span className="appbar-title">HACKER.DEV</span>
      </div>
      <input className="appbar-search" placeholder="Search" />
      <div className="appbar-user" ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="appbar-bell" style={{ color: '#181c23', fontSize: '1.3rem', margin: '0 6px 0 0' }}>🔔</span>
        <div className="appbar-user-info" style={{ textAlign: 'right', alignSelf: 'flex-start', marginTop: '2px' }}>
          <div className="appbar-user-name" style={{ color: '#181c23', fontWeight: 700, fontSize: '1.08rem' }}>Ales Turner</div>
          <div className="appbar-user-role" style={{ color: '#bfc6d1', fontSize: '0.98rem' }}>Sophie</div>
        </div>
        <div
          className="appbar-user-avatar"
          style={{ background: '#e0e0e0', color: '#232733', fontWeight: 700, fontSize: '1.1rem', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          onClick={() => setMenuOpen((open) => !open)}
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          AT
        </div>
        {menuOpen && (
          <div className="appbar-user-dropdown">
            <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>Home</button>
            <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>Profile</button>
            <button className="appbar-user-dropdown-item">Settings</button>
            <div className="appbar-user-dropdown-divider" />
            <button className="appbar-user-dropdown-item appbar-user-dropdown-signout">Sign Out</button>
          </div>
        )}
      </div>
    </header>
  );
}