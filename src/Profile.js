import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';

export default function Profile() {
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

  // Sample data for charts
  const domainData = [
    { name: 'Web Development', value: 35, color: '#667eea' },
    { name: 'AI/ML', value: 25, color: '#764ba2' },
    { name: 'Mobile Apps', value: 20, color: '#f093fb' },
    { name: 'Blockchain', value: 12, color: '#4facfe' },
    { name: 'IoT', value: 8, color: '#43e97b' },
  ];

  const languageData = [
    { name: 'JavaScript', value: 40, color: '#f7df1e' },
    { name: 'Python', value: 30, color: '#3776ab' },
    { name: 'Java', value: 15, color: '#007396' },
    { name: 'C++', value: 10, color: '#00599c' },
    { name: 'Go', value: 5, color: '#00add8' },
  ];

  // Calculate pie chart paths
  const createPieChart = (data) => {
    let currentAngle = 0;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return data.map((item) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      currentAngle = endAngle;
      
      // Convert angles to radians and calculate path
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = 50 + 45 * Math.cos(startRad);
      const y1 = 50 + 45 * Math.sin(startRad);
      const x2 = 50 + 45 * Math.cos(endRad);
      const y2 = 50 + 45 * Math.sin(endRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const path = `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      return { ...item, path, percentage: percentage.toFixed(1) };
    });
  };

  const domainChartData = createPieChart(domainData);
  const languageChartData = createPieChart(languageData);

  return (
    <div className={"dashboard-root" + (sidebarOpen ? "" : " sidebar-collapsed")}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <img src={logoImg} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Alex Turner</div>
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
            <li onClick={() => navigate('/dashboard')}>Dashboard</li>
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
              <div className="appbar-user-name">Alex Turner</div>
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

        {/* Profile Content */}
        <div className="profile-container">
          <div className="profile-header-section">
            <div className="profile-avatar-large">AT</div>
            <div className="profile-header-info">
              <h1 className="profile-name">Alex Turner</h1>
              <p className="profile-email">alex.turner@email.com</p>
              <p className="profile-member-since">Member since October 2024</p>
            </div>
            <button className="profile-edit-btn" onClick={() => navigate('/edit-profile')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Stats Grid */}
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="profile-stat-icon">🏆</div>
              <div className="profile-stat-value">1,250</div>
              <div className="profile-stat-label">Total Points</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">👥</div>
              <div className="profile-stat-value">8</div>
              <div className="profile-stat-label">Communities Joined</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">🚀</div>
              <div className="profile-stat-value">15</div>
              <div className="profile-stat-label">Hackathons Participated</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">🎯</div>
              <div className="profile-stat-value">12</div>
              <div className="profile-stat-label">Projects Completed</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="profile-charts-section">
            {/* Domain Chart */}
            <div className="profile-chart-card">
              <h3 className="profile-chart-title">Hackathon Domains</h3>
              <div className="profile-chart-container">
                <svg viewBox="0 0 100 100" className="profile-pie-chart">
                  {domainChartData.map((item, index) => (
                    <path
                      key={index}
                      d={item.path}
                      fill={item.color}
                      className="profile-pie-slice"
                    />
                  ))}
                </svg>
                <div className="profile-chart-legend">
                  {domainChartData.map((item, index) => (
                    <div key={index} className="profile-legend-item">
                      <div className="profile-legend-color" style={{ backgroundColor: item.color }}></div>
                      <span className="profile-legend-text">{item.name}</span>
                      <span className="profile-legend-value">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Language Chart */}
            <div className="profile-chart-card">
              <h3 className="profile-chart-title">Programming Languages</h3>
              <div className="profile-chart-container">
                <svg viewBox="0 0 100 100" className="profile-pie-chart">
                  {languageChartData.map((item, index) => (
                    <path
                      key={index}
                      d={item.path}
                      fill={item.color}
                      className="profile-pie-slice"
                    />
                  ))}
                </svg>
                <div className="profile-chart-legend">
                  {languageChartData.map((item, index) => (
                    <div key={index} className="profile-legend-item">
                      <div className="profile-legend-color" style={{ backgroundColor: item.color }}></div>
                      <span className="profile-legend-text">{item.name}</span>
                      <span className="profile-legend-value">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="profile-points-section">
            <h3 className="profile-section-title">Points Breakdown</h3>
            <div className="profile-points-grid">
              <div className="profile-points-item">
                <div className="profile-points-item-header">
                  <span className="profile-points-item-icon">🎯</span>
                  <span className="profile-points-item-title">Hackathon Participation</span>
                </div>
                <div className="profile-points-bar">
                  <div className="profile-points-bar-fill" style={{ width: '75%', backgroundColor: '#667eea' }}></div>
                </div>
                <span className="profile-points-item-value">750 pts</span>
              </div>
              <div className="profile-points-item">
                <div className="profile-points-item-header">
                  <span className="profile-points-item-icon">💬</span>
                  <span className="profile-points-item-title">Community Involvement</span>
                </div>
                <div className="profile-points-bar">
                  <div className="profile-points-bar-fill" style={{ width: '60%', backgroundColor: '#764ba2' }}></div>
                </div>
                <span className="profile-points-item-value">300 pts</span>
              </div>
              <div className="profile-points-item">
                <div className="profile-points-item-header">
                  <span className="profile-points-item-icon">✅</span>
                  <span className="profile-points-item-title">Project Completion</span>
                </div>
                <div className="profile-points-bar">
                  <div className="profile-points-bar-fill" style={{ width: '40%', backgroundColor: '#f093fb' }}></div>
                </div>
                <span className="profile-points-item-value">200 pts</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="profile-activity-section">
            <h3 className="profile-section-title">Recent Activity</h3>
            <div className="profile-activity-list">
              <div className="profile-activity-item">
                <div className="profile-activity-icon" style={{ backgroundColor: '#667eea' }}>🏆</div>
                <div className="profile-activity-content">
                  <p className="profile-activity-title">Won 2nd place in AI Hackathon 2025</p>
                  <p className="profile-activity-time">2 days ago</p>
                </div>
              </div>
              <div className="profile-activity-item">
                <div className="profile-activity-icon" style={{ backgroundColor: '#764ba2' }}>👥</div>
                <div className="profile-activity-content">
                  <p className="profile-activity-title">Joined React Developers Community</p>
                  <p className="profile-activity-time">5 days ago</p>
                </div>
              </div>
              <div className="profile-activity-item">
                <div className="profile-activity-icon" style={{ backgroundColor: '#f093fb' }}>📊</div>
                <div className="profile-activity-content">
                  <p className="profile-activity-title">Completed Web3 Project</p>
                  <p className="profile-activity-time">1 week ago</p>
                </div>
              </div>
              <div className="profile-activity-item">
                <div className="profile-activity-icon" style={{ backgroundColor: '#4facfe' }}>🚀</div>
                <div className="profile-activity-content">
                  <p className="profile-activity-title">Participated in Global Code Jam</p>
                  <p className="profile-activity-time">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
