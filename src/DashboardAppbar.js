import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getUserInitials } from './utils/profileUtils';

export default function DashboardAppbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserProfile(getUserProfile());
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When menu opens, ensure the dropdown is visible (scroll into view)
  useEffect(() => {
    if (menuOpen && dropdownRef.current) {
      // Smoothly scroll the dropdown into view if it's outside the viewport
      dropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [menuOpen]);

  return (
    <header className="dashboard-appbar">
      <div className="appbar-left">
        <span className="appbar-title">HACKER.DEV</span>
      </div>
      <input className="appbar-search" placeholder="Search" />
      <div className="appbar-user" ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="appbar-bell" style={{ color: '#181c23', fontSize: '1.3rem', margin: '0 6px 0 0' }}>🔔</span>
        <div className="appbar-user-info">
          <div className="appbar-user-name">{userProfile.name}</div>
        </div>
        <div
          className="appbar-user-avatar"
          style={{ background: '#e0e0e0', color: '#232733', fontWeight: 700, fontSize: '1.1rem', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          onClick={() => setMenuOpen((open) => !open)}
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          {getUserInitials(userProfile.name)}
        </div>
        {menuOpen && (
          <div className="appbar-user-dropdown" ref={dropdownRef}>
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