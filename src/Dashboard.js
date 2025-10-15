import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
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
    <div className={"dashboard-root" + (sidebarOpen ? "" : " sidebar-collapsed")}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <img src={logoImg} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Ales Turner</div>
            <div className="sidebar-user-role">Student</div>
            <div className="sidebar-user-status">Active</div>
          </div>
              {sidebarOpen && (
                <button className="sidebar-toggle sidebar-toggle--sidebar" onClick={() => setSidebarOpen(false)} aria-label="Collapse sidebar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">Dashboard</li>
            <li onClick={() => navigate('/recent-hackathons')}>Recent Hackathons</li>
            <li onClick={() => navigate('/communities')}>Communities</li>
            <li onClick={() => navigate('/notifications')}>Notifications</li>
            <li onClick={() => navigate('/deadlines')}>Deadlines</li>
            <li onClick={() => navigate('/activity')}>Activity</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        {/* Top App Bar */}
        <header className="dashboard-appbar">
          <div className="appbar-left">
            {!sidebarOpen && (
              <button className="appbar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
          <input className="appbar-search" placeholder="Search" />
          <div className="appbar-user" ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="appbar-bell" style={{ color: '#181c23', fontSize: '1.3rem', margin: '0 6px 0 0' }}>🔔</span>
            <div className="appbar-user-info">
              <div className="appbar-user-name">Ales Turner</div>
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
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>Profile</button>
                <button className="appbar-user-dropdown-item">Settings</button>
                <div className="appbar-user-dropdown-divider" />
                <button className="appbar-user-dropdown-item appbar-user-dropdown-signout">Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Row 1 */}
          <div className="dashboard-card stats-card">
            <div className="stats-header">
              <button className="stats-btn stats-btn-primary" onClick={() => navigate('/community-create')}>Create New Community</button>
              <button className="stats-btn" onClick={() => navigate('/activity')}>Find Jobs</button>
            </div>
            <div className="stats-body">
              <div className="stats-empty-state">
                <span className="stats-empty-icon">📊</span>
                <p className="stats-empty-text">No activity yet. Start by joining a community or participating in a hackathon!</p>
              </div>
            </div>
          </div>
          <div className="dashboard-card projects-card">
            <div className="projects-header">My Projects</div>
            <div className="projects-empty-state">
              <span className="projects-empty-icon">📁</span>
              <p className="projects-empty-text">No projects yet</p>
              <button className="project-btn-primary" onClick={() => navigate('/communities')}>Start Your First Project</button>
            </div>
          </div>
          <div className="dashboard-card hackathons-card">
            <div className="hackathons-header">Latest Hackathons</div>
            <div className="hackathons-list">
              <div className="hackathon-item">
                <div className="hackathon-title">Global Code Jam 2024</div>
                <div className="hackathon-date">Oct 19, 2024</div>
                <span className="hackathon-status open">Registration Spots</span>
              </div>
              <div className="hackathon-item">
                <div className="hackathon-title">AI Immmurd Sprint</div>
                <div className="hackathon-date">Oct 13, 3005</div>
                <span className="hackathon-status upcoming">Upcoming</span>
              </div>
              <div className="hackathon-item">
                <div className="hackathon-title">Web Wicard Challenge</div>
                <div className="hackathon-date">Oct 26, 2633</div>
                <span className="hackathon-status open">Registration Open</span>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="dashboard-card communities-card">
            <div className="communities-header">Your Communities</div>
            <div className="communities-empty-state">
              <span className="communities-empty-icon">👥</span>
              <p className="communities-empty-text">You haven't joined any communities yet</p>
              <button className="community-btn-join" onClick={() => navigate('/communities')}>Browse Communities</button>
            </div>
          </div>
          <div className="dashboard-card deadlines-card">
            <div className="deadlines-header">Deadlines Nearby</div>
            <div className="deadlines-list">
              <div className="deadline-item">
                <div className="deadline-title">Global Code Jam Registration</div>
                <div className="deadline-date">Nov 15, 2025</div>
                <span className="deadline-status urgent">2 days left</span>
              </div>
              <div className="deadline-item">
                <div className="deadline-title">AI Hackathon Submission</div>
                <div className="deadline-date">Nov 20, 2025</div>
                <span className="deadline-status warning">7 days left</span>
              </div>
              <div className="deadline-item">
                <div className="deadline-title">Web Dev Sprint Finals</div>
                <div className="deadline-date">Nov 25, 2025</div>
                <span className="deadline-status normal">12 days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}