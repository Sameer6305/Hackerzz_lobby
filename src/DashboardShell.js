import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Briefcase, ChevronLeft, ChevronRight, Clock, LayoutDashboard, LogOut, Settings, Trophy, User, Users } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { getUserProfile, getUserInitials } from './utils/profileUtils';
import { signOutUser } from './utils/authUtils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/recent-hackathons', label: 'Recent Hackathons', icon: Trophy },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/deadlines', label: 'Deadlines', icon: Clock },
  { to: '/activity', label: 'Activity', icon: Briefcase },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardShell({ children, userProfile: userProfileProp }) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(userProfileProp || getUserProfile());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUserProfile(userProfileProp || getUserProfile());
  }, [userProfileProp]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserProfile(userProfileProp || getUserProfile());
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [userProfileProp]);

  useEffect(() => {
    function handleClickOutside(event) {
      const target = event.target;
      if (target instanceof HTMLElement && !target.closest('.dashboard-shell__user')) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    const result = signOutUser();
    if (result.success) {
      navigate('/signin');
    }
  };

  return (
    <div className={`dashboard-shell dashboard-root${collapsed ? ' sidebar-collapsed' : ''}`}>
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <BrandLogo label="Hackerzz Lobby" showLabel={false} className="sidebar-logo-wrap" imageClassName="sidebar-logo" />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userProfile?.name || 'User'}</div>
            <div className="sidebar-user-role">Student</div>
            <div className="sidebar-user-status">Active</div>
          </div>
          {!collapsed && (
            <button className="sidebar-toggle sidebar-toggle--sidebar" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar">
              <ChevronLeft size={18} />
            </button>
          )}
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.to === '/profile'
                ? location.pathname === '/profile' || location.pathname === '/edit-profile'
                : item.to === '/communities'
                  ? location.pathname === '/communities' || location.pathname.startsWith('/community/')
                  : location.pathname === item.to;

              return (
                <li
                  key={item.to}
                  className={isActive ? 'active' : ''}
                  onClick={() => navigate(item.to)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="dashboard-main-area">
        <header className="dashboard-appbar">
          <div className="appbar-left">
            {collapsed && (
              <button className="appbar-toggle" onClick={() => setCollapsed(false)} aria-label="Open sidebar">
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          <input className="appbar-search" placeholder="Search" />

          <div className="appbar-user dashboard-shell__user">
            <button className="appbar-bell-button" type="button" onClick={() => navigate('/notifications')} aria-label="Open notifications">
              <Bell size={20} />
            </button>
            <div className="appbar-user-info">
              <div className="appbar-user-name">{userProfile?.name || 'User'}</div>
            </div>
            <button
              type="button"
              className="appbar-user-avatar"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {getUserInitials(userProfile?.name)}
            </button>

            {menuOpen && (
              <div className="appbar-user-dropdown">
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>Profile</button>
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/settings'); }}>Settings</button>
                <div className="appbar-user-dropdown-divider" />
                <button className="appbar-user-dropdown-item appbar-user-dropdown-signout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}