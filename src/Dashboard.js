
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';


export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('profileName') || 'Alex Turner';
  });

  useEffect(() => {
    function syncProfileName() {
      const name = localStorage.getItem('profileName') || 'Alex Turner';
      setProfileName(name);
    }
    window.addEventListener('storage', syncProfileName);
    return () => window.removeEventListener('storage', syncProfileName);
  }, []);

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
          <img src={logoImg} alt="Logo" className="dashboard-logo-img" />
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
                <button className="dashboard-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>Profile</button>
                <button className="dashboard-user-dropdown-item">Settings</button>
                <div className="dashboard-user-dropdown-divider" />
                <button className="dashboard-user-dropdown-item dashboard-user-dropdown-signout">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="dashboard-3col-layout">
        {/* Left Sidebar */}
        <aside className="dashboard-leftbar">
          <div className="dashboard-user-card">
            <img src={logoImg} alt="Logo" className="dashboard-logo-img dashboard-logo-img-sidebar" />
            <div className="dashboard-user-avatar">{profileName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}</div>
            <div className="dashboard-user-name">{profileName}</div>
            <div className="dashboard-user-role">Student</div>
            <div className="dashboard-user-status-active">Active</div>
            <div className="dashboard-profile-progress">
              <div className="dashboard-profile-progress-bar" style={{width: '42%'}}></div>
              <span className="dashboard-profile-progress-label">42%</span>
            </div>
          </div>
          <ul className="dash-menu">
            <li className="active">Dashboard</li>
            <li>Recent Hackathons</li>
            <li>Communities</li>
            <li>Inbox</li>
            <li>Deadlines</li>
            <li>Activity</li>
            <li onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>Profile</li>
          </ul>
          <button className="dash-signout">Sign Out</button>
        </aside>
        {/* Main Content */}
        <main className="dashboard-main-content">
          {/* ...existing dashboard main content (header, cards, etc) goes here... */}
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div className="dashboard-header-title">Your Hacker Stats</div>
            <div className="dashboard-header-actions">
              <button className="dashboard-create-btn">Create New Community</button>
              <button className="dashboard-header-btn" onClick={() => navigate('/profile')}>View Profile</button>
              <button className="dashboard-header-btn">Connect Apps</button>
            </div>
          </div>
          <div className="dashboard-cards-row">
            <div className="dashboard-card dashboard-card-stats">
              <div className="dashboard-card-title">Your Hacker Stats</div>
              <div className="dashboard-card-content dashboard-stats">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">🏆</span>
                  3 Active Communities
                </div>
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">🚀</span>
                  Top 5% Community Contributor
                </div>
              </div>
            </div>
            <div className="dashboard-card dashboard-card-projects">
              <div className="dashboard-card-title">My Projects</div>
              <button className="dashboard-create-btn dashboard-create-btn-small">+ Create New project</button>
              <div className="dashboard-card-content">
                <div className="dashboard-project-card">
                  <span className="dashboard-project-icon">📦</span>
                  <div>
                    <div className="dashboard-project-title">React Learners</div>
                    <div className="dashboard-project-desc">Priority</div>
                  </div>
                  <span className="dashboard-project-status dashboard-project-status-soon">Soon</span>
                </div>
                <div className="dashboard-project-card">
                  <span className="dashboard-project-icon">💡</span>
                  <div>
                    <div className="dashboard-project-title">AI Innovate</div>
                  </div>
                  <span className="dashboard-project-status dashboard-project-status-active">Active</span>
                </div>
                <div className="dashboard-project-card">
                  <span className="dashboard-project-icon">⭐</span>
                  <div>
                    <div className="dashboard-project-title">Web Wizard</div>
                  </div>
                  <span className="dashboard-project-status dashboard-project-status-live">Live</span>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-cards-row">
            <div className="dashboard-card dashboard-card-communities">
              <div className="dashboard-card-title">Your Communities</div>
              <div className="dashboard-card-content">
                <div className="dashboard-community-list">
                  <div className="dashboard-community-item">
                    <span className="dashboard-community-icon">�</span>
                    <div>
                      <div className="dashboard-community-title">React Learners</div>
                      <div className="dashboard-community-desc">Pioneering all the plans to connect with the most of the client.</div>
                    </div>
                    <span className="dashboard-community-status dashboard-community-status-active">Active</span>
                  </div>
                  <div className="dashboard-community-item">
                    <span className="dashboard-community-icon">⭐</span>
                    <div>
                      <div className="dashboard-community-title">Web Wizard</div>
                      <div className="dashboard-community-desc">Vision driven group to solve ideas. My restmaker teammates/friends.</div>
                    </div>
                    <span className="dashboard-community-status dashboard-community-status-inactive">Inactive</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-card dashboard-card-activity">
              <div className="dashboard-card-title">Recent Activity</div>
              <div className="dashboard-card-content">
                <div className="dashboard-activity-list">
                  <div className="dashboard-activity-item">
                    <span className="dashboard-activity-icon">🔗</span>
                    <div>
                      <div className="dashboard-activity-title">Joined React Learners</div>
                      <div className="dashboard-activity-desc">Joined event beyond the stack - the chief</div>
                    </div>
                    <span className="dashboard-activity-status dashboard-activity-status-active">Active</span>
                  </div>
                  <div className="dashboard-activity-item">
                    <span className="dashboard-activity-icon">🚀</span>
                    <div>
                      <div className="dashboard-activity-title">Created AI Hackathon</div>
                      <div className="dashboard-activity-desc">2 Hetto St Hackathon</div>
                    </div>
                    <span className="dashboard-activity-status dashboard-activity-status-active">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* Right Sidebar */}
        <aside className="dashboard-rightbar">
          <div className="dashboard-card dashboard-latest-hackathons">
            <div className="dashboard-card-title">Latest Hackathons</div>
            <div className="dashboard-latest-hackathon-list">
              <div className="dashboard-latest-hackathon-item">
                <div className="dashboard-latest-hackathon-title">Global Code Jam 2024</div>
                <div className="dashboard-latest-hackathon-date">Oct 10, 2025</div>
                <div className="dashboard-latest-hackathon-status">Registration Open</div>
              </div>
              <div className="dashboard-latest-hackathon-item">
                <div className="dashboard-latest-hackathon-title">AI Innovate Sprint</div>
                <div className="dashboard-latest-hackathon-date">Oct 15, 2025</div>
                <div className="dashboard-latest-hackathon-status">Upcoming</div>
              </div>
              <div className="dashboard-latest-hackathon-item">
                <div className="dashboard-latest-hackathon-title">Web Wizard Challenge</div>
                <div className="dashboard-latest-hackathon-date">Oct 20, 2025</div>
                <div className="dashboard-latest-hackathon-status">Upcoming</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}