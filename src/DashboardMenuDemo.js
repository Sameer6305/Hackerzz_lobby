import React, { useState, useRef, useEffect } from 'react';
import './App.css';

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard-outer">
      {/* Top App Bar */}
      <div className="dashboard-appbar">
        <div className="dashboard-appbar-logo">
          <span className="dashboard-logo-icon">🦾</span>Hackerzz Lobby
        </div>
        <input className="dashboard-search" placeholder="Search..." />
        <div className="dashboard-appbar-actions">
          <span className="dashboard-appbar-bell">🔔</span>
          <div className="dashboard-appbar-user-menu-wrapper" ref={menuRef}>
            <span
              className="dashboard-appbar-user dashboard-appbar-user-clickable"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Alex Turner ▾
            </span>
            {menuOpen && (
              <div className="dashboard-user-dropdown">
                <button className="dashboard-user-dropdown-item">Profile</button>
                <button className="dashboard-user-dropdown-item">Settings</button>
                <div className="dashboard-user-dropdown-divider" />
                <button className="dashboard-user-dropdown-item dashboard-user-dropdown-signout">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ...existing code... */}
    </div>
  );
}
