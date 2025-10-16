import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';
import { getUserProfile, getUserInitials } from './utils/profileUtils';

export default function Communities() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      setUserProfile(event.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  // Load communities from localStorage
  useEffect(() => {
    const storedCommunities = JSON.parse(localStorage.getItem('communities') || '[]');
    setCommunities(storedCommunities);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
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
            <div className="sidebar-user-name">{userProfile.name}</div>
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
            <li className="active">Communities</li>
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
              <div className="appbar-user-dropdown">
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>Profile</button>
                <button className="appbar-user-dropdown-item">Settings</button>
                <div className="appbar-user-dropdown-divider" />
                <button className="appbar-user-dropdown-item appbar-user-dropdown-signout">Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Communities Content */}
        <div className="communities-content">
          <div className="communities-header">
            <h1 className="communities-title">{userProfile.name}'s Communities</h1>
            <button className="create-community-btn" onClick={() => navigate('/community-create')}>
              + Create Community
            </button>
          </div>

          {/* Scrollable Communities Section */}
          <div className="communities-scrollable">
            {/* Featured Communities Section */}
            <section className="communities-section">
              <h2 className="section-title">Featured Communities to Join</h2>
              <div className="communities-grid">
                <div className="community-card">
                  <div className="community-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    🚀
                  </div>
                  <div className="community-info">
                    <h3 className="community-name">AI Innovate Community</h3>
                    <p className="community-description">AI project that can help spread the your team goals.</p>
                  </div>
                  <button className="join-btn">+ Join</button>
                </div>

                <div className="community-card">
                  <div className="community-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    🤖
                  </div>
                  <div className="community-info">
                    <h3 className="community-name">AI Innovate</h3>
                    <p className="community-description">AI create an circulus good and them commit jouh.</p>
                  </div>
                  <button className="join-btn">+ Join</button>
                </div>

                <div className="community-card">
                  <div className="community-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    💻
                  </div>
                  <div className="community-info">
                    <h3 className="community-name">Web Dev Guild</h3>
                    <p className="community-description">All create an loving as total to good doe it thing.</p>
                  </div>
                  <button className="join-btn">+ Join</button>
                </div>

                <div className="community-card">
                  <div className="community-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                    🌐
                  </div>
                  <div className="community-info">
                    <h3 className="community-name">Web Dev Guild</h3>
                    <p className="community-description">All race ad the your insentive first comm bonds.</p>
                  </div>
                  <button className="join-btn">+ Join</button>
                </div>
              </div>
            </section>

            {/* Explore by Topic Section */}
            <section className="communities-section">
              <h2 className="section-title">Explore by Topic</h2>
              <div className="topic-icons">
                <div className="topic-icon" style={{ background: '#ff6b6b' }}>🔺</div>
                <div className="topic-icon" style={{ background: '#4ecdc4' }}>🔧</div>
                <div className="topic-icon" style={{ background: '#9b59b6' }}>🎮</div>
                <div className="topic-icon" style={{ background: '#3498db' }}>💬</div>
                <div className="topic-icon" style={{ background: '#f39c12' }}>📊</div>
              </div>
              <p className="topic-subtitle">No communities yet? Start by exploring or create by own!</p>
              
              <div className="topic-cards">
                <div className="topic-card">
                  <div className="topic-card-icon">🧠</div>
                  <span className="topic-card-name">Machine Mearning</span>
                </div>
                <div className="topic-card">
                  <div className="topic-card-icon">🎮</div>
                  <span className="topic-card-name">Game Development</span>
                </div>
                <div className="topic-card">
                  <div className="topic-card-icon">☁️</div>
                  <span className="topic-card-name">Cloud Computing</span>
                </div>
                <div className="topic-card">
                  <div className="topic-card-icon">💻</div>
                  <span className="topic-card-name">Cloud Computing</span>
                </div>
              </div>
            </section>

            {/* Your Communities Section */}
            <section className="communities-section your-communities-section">
              <h2 className="section-title">Your Communities</h2>
              {communities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🏘️</div>
                  <h3 className="empty-state-title">No communities joined yet</h3>
                  <p className="empty-state-text">Join a community above or create your own to get started!</p>
                  <button className="empty-state-btn" onClick={() => navigate('/community-create')}>
                    Create Your First Community
                  </button>
                </div>
              ) : (
                <div className="communities-grid">
                  {communities.map((community) => (
                    <div key={community.id} className="community-card user-community-card">
                      <div className="community-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        {community.projectDomain.charAt(0).toUpperCase()}
                      </div>
                      <div className="community-info">
                        <h3 className="community-name">{community.communityName}</h3>
                        <p className="community-description">{community.description || community.projectName}</p>
                        <div className="community-meta">
                          <span className="community-meta-item">🎯 {community.projectDomain}</span>
                          <span className="community-meta-item">👥 {community.members.length || community.numberOfMembers || 0} members</span>
                        </div>
                      </div>
                      <button className="enter-community-btn" onClick={() => navigate(`/community/${community.id}`)}>
                        Enter Community →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
