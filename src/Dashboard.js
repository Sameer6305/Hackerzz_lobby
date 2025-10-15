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
              <button className="stats-btn" onClick={() => navigate('/activity')}>Connect Apps</button>
            </div>
            <div className="stats-body">
              <div className="stats-item">
                <span className="stats-icon">🏆</span>
                <span>3 Active Communities</span>
              </div>
              <div className="stats-item">
                <span className="stats-icon">🚀</span>
                <span>Top 5% Community Contributor</span>
                <span className="stats-badge-active">Active</span>
              </div>
            </div>
          </div>
          <div className="dashboard-card projects-card">
            <div className="projects-header">My Projects</div>
            <div className="projects-list">
              <div className="project-item">
                <img src={logoImg} alt="React Learners" className="project-avatar" />
                <div>
                  <div className="project-title">React Learners Priority</div>
                  <div className="project-desc">X03 0900</div>
                </div>
                <button className="project-btn-primary">Create new prject</button>
              </div>
              <div className="project-item">
                <img src={logoImg} alt="React Lesmers" className="project-avatar" />
                <div>
                  <div className="project-title">React Lesmers Priority</div>
                  <div className="project-desc">103 9000</div>
                </div>
                <span className="project-status soon">Soon</span>
              </div>
              <div className="project-item">
                <img src={logoImg} alt="AI Imnevate" className="project-avatar" />
                <div>
                  <div className="project-title">AI Imnevate</div>
                  <div className="project-desc">103.19.06</div>
                </div>
              </div>
              <div className="project-item">
                <img src={logoImg} alt="Web Wicard" className="project-avatar" />
                <div>
                  <div className="project-title">Web Wicard</div>
                  <div className="project-desc">193.39.06</div>
                </div>
                <span className="project-status live">Live</span>
              </div>
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
            <div className="communities-list">
              <div className="community-item">
                <div className="community-title">Reeet Ecore Penewitt</div>
                <div className="community-desc">601.19.90</div>
              </div>
              <div className="community-item">
                <div className="community-title">Alos Riewe Ewmetol</div>
                <div className="community-desc">601.19.90</div>
              </div>
              <div className="community-item">
                <div className="community-title">Plown/nitte 9 etesert</div>
                <div className="community-desc">601.19.90</div>
              </div>
            </div>
          </div>
          <div className="dashboard-card activity-card">
            <div className="activity-header">Recent Activity</div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-title">Global Code Jam 2024</div>
                <div className="activity-date">10.3.040</div>
                <span className="activity-status">Entrance Instance</span>
              </div>
              <div className="activity-item">
                <div className="activity-title">Global Code Jam 2024</div>
                <div className="activity-date">161.142.010.1D0E</div>
                <span className="activity-status">Activity</span>
              </div>
              <div className="activity-item">
                <div className="activity-title">Web Wizard Challenge</div>
                <div className="activity-date">QX 10.3.063</div>
                <span className="activity-status">Versions</span>
              </div>
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
                <div className="hackathon-title">AI Innovate Sprint</div>
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
        </div>
      </div>
    </div>
  );
}