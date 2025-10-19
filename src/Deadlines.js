import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';
import { getUserProfile, getUserInitials } from './utils/profileUtils';
import { signOutUser } from './utils/authUtils';

export default function Deadlines() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [allDeadlines, setAllDeadlines] = useState([]);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Handle sign out
  const handleSignOut = () => {
    const result = signOutUser();
    if (result.success) {
      navigate('/');
    }
  };

  // Load all deadlines from all communities
  const loadDeadlines = () => {
    try {
      const communities = JSON.parse(localStorage.getItem('communities') || '[]');
      console.log('All communities:', communities);
      
      // Collect all deadlines from ALL communities (simplified - no filtering)
      const deadlines = [];
      communities.forEach(community => {
        if (community.deadlines && community.deadlines.length > 0) {
          console.log(`Found ${community.deadlines.length} deadlines in ${community.name}`);
          community.deadlines.forEach(deadline => {
            deadlines.push({
              ...deadline,
              communityName: community.name,
              communityId: community.id
            });
          });
        }
      });

      console.log('Total deadlines found:', deadlines.length);
      
      // Sort deadlines by date (earliest first)
      deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));
      setAllDeadlines(deadlines);
    } catch (error) {
      console.error('Error loading deadlines:', error);
    }
  };

  // Load deadlines on mount and set up listeners
  useEffect(() => {
    loadDeadlines();
    
    // Listen for custom deadline update events
    const handleDeadlineUpdate = () => {
      console.log('Deadlines updated event received!');
      loadDeadlines();
    };
    
    window.addEventListener('deadlinesUpdated', handleDeadlineUpdate);
    
    // Poll for updates every 2 seconds (fallback mechanism)
    const pollInterval = setInterval(() => {
      console.log('Polling for deadline updates...');
      loadDeadlines();
    }, 2000);
    
    return () => {
      window.removeEventListener('deadlinesUpdated', handleDeadlineUpdate);
      clearInterval(pollInterval);
    };
  }, []);

  // Calculate days until deadline
  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateString);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Group deadlines by time period
  const groupedDeadlines = {
    today: [],
    upcoming: [],
    later: [],
    overdue: []
  };

  allDeadlines.forEach(deadline => {
    const daysUntil = getDaysUntil(deadline.date);
    if (daysUntil < 0) {
      groupedDeadlines.overdue.push(deadline);
    } else if (daysUntil === 0) {
      groupedDeadlines.today.push(deadline);
    } else if (daysUntil <= 7) {
      groupedDeadlines.upcoming.push(deadline);
    } else {
      groupedDeadlines.later.push(deadline);
    }
  });


  // Listen for profile updates
  React.useEffect(() => {
    const handleProfileUpdate = () => {
      setUserProfile(getUserProfile());
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

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
            <li onClick={() => navigate('/communities')}>Communities</li>
            <li onClick={() => navigate('/notifications')}>Notifications</li>
            <li className="active">Deadlines</li>
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
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/settings'); }}>Settings</button>
                <div className="appbar-user-dropdown-divider" />
                <button className="appbar-user-dropdown-item appbar-user-dropdown-signout" onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Deadlines Content - Main Grid */}
        <div className="dashboard-grid" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Your Hackathon Deadlines Header */}
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
            Your Hackathon Deadlines
          </h1>

          {/* Debug Info - Remove after testing */}
          <div style={{ 
            padding: '12px', 
            background: '#f7fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}>
            <div><strong>Debug Info:</strong></div>
            <div>Total Deadlines: {allDeadlines.length}</div>
            <div>Check browser console for logs</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button 
                onClick={() => {
                  const communities = JSON.parse(localStorage.getItem('communities') || '[]');
                  console.log('=== MANUAL DEBUG ===');
                  console.log('Communities:', communities);
                  console.log('Deadlines:', allDeadlines);
                  communities.forEach((c, i) => {
                    console.log(`Community ${i}:`, c.name, 'Deadlines:', c.deadlines?.length || 0);
                  });
                }}
                style={{
                  padding: '6px 12px',
                  background: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Show Debug Data
              </button>
              <button 
                onClick={loadDeadlines}
                style={{
                  padding: '6px 12px',
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🔄 Refresh Now
              </button>
            </div>
          </div>

          {/* No Deadlines State */}
          {allDeadlines.length === 0 && (
            <div>
              <h2 className="deadline-section-title" style={{ marginBottom: '16px' }}>Today</h2>
              <div className="deadline-empty-card">
                <div className="deadline-empty-icon">
                  📅
                </div>
                <h3 className="deadline-empty-title">No Upcoming Deadlines Yet!</h3>
                <p className="deadline-empty-text">Join hackathons to start tracking of deadlines here</p>
                <button className="deadline-find-btn" onClick={() => navigate('/recent-hackathons')}>
                  Find Hackathons
                </button>
              </div>
            </div>
          )}

          {/* Overdue Deadlines */}
          {groupedDeadlines.overdue.length > 0 && (
            <div>
              <h2 className="deadline-section-title" style={{ marginBottom: '16px', color: '#e53e3e' }}>
                ⚠️ Overdue ({groupedDeadlines.overdue.length})
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {groupedDeadlines.overdue.map((deadline) => {
                  const daysOverdue = Math.abs(getDaysUntil(deadline.date));
                  return (
                    <div 
                      key={deadline.id} 
                      className="deadline-card overdue"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/community/${deadline.communityId}`)}
                    >
                      <div className="deadline-card-header">
                        <h4 className="deadline-card-title">{deadline.title}</h4>
                        <span className={`deadline-priority ${deadline.priority}`}>
                          {deadline.priority}
                        </span>
                      </div>
                      <div className="deadline-card-body">
                        <span className="deadline-date">📅 {formatDate(deadline.date)}</span>
                        <span className="deadline-countdown overdue">
                          Overdue by {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#718096' }}>
                        📍 {deadline.communityName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Today's Deadlines */}
          {groupedDeadlines.today.length > 0 && (
            <div>
              <h2 className="deadline-section-title" style={{ marginBottom: '16px', color: '#dd6b20' }}>
                📅 Today ({groupedDeadlines.today.length})
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {groupedDeadlines.today.map((deadline) => (
                  <div 
                    key={deadline.id} 
                    className="deadline-card urgent"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/community/${deadline.communityId}`)}
                  >
                    <div className="deadline-card-header">
                      <h4 className="deadline-card-title">{deadline.title}</h4>
                      <span className={`deadline-priority ${deadline.priority}`}>
                        {deadline.priority}
                      </span>
                    </div>
                    <div className="deadline-card-body">
                      <span className="deadline-date">📅 {formatDate(deadline.date)}</span>
                      <span className="deadline-countdown urgent">
                        Today!
                      </span>
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#718096' }}>
                      📍 {deadline.communityName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Deadlines (Next 7 days) */}
          {groupedDeadlines.upcoming.length > 0 && (
            <div>
              <h2 className="deadline-section-title" style={{ marginBottom: '16px', color: '#d69e2e' }}>
                ⏰ This Week ({groupedDeadlines.upcoming.length})
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {groupedDeadlines.upcoming.map((deadline) => {
                  const daysUntil = getDaysUntil(deadline.date);
                  return (
                    <div 
                      key={deadline.id} 
                      className="deadline-card warning"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/community/${deadline.communityId}`)}
                    >
                      <div className="deadline-card-header">
                        <h4 className="deadline-card-title">{deadline.title}</h4>
                        <span className={`deadline-priority ${deadline.priority}`}>
                          {deadline.priority}
                        </span>
                      </div>
                      <div className="deadline-card-body">
                        <span className="deadline-date">📅 {formatDate(deadline.date)}</span>
                        <span className="deadline-countdown warning">
                          {daysUntil} day{daysUntil !== 1 ? 's' : ''} left
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#718096' }}>
                        📍 {deadline.communityName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Later Deadlines (Beyond 7 days) */}
          {groupedDeadlines.later.length > 0 && (
            <div>
              <h2 className="deadline-section-title" style={{ marginBottom: '16px', color: '#38b2ac' }}>
                📆 Later ({groupedDeadlines.later.length})
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {groupedDeadlines.later.map((deadline) => {
                  const daysUntil = getDaysUntil(deadline.date);
                  return (
                    <div 
                      key={deadline.id} 
                      className="deadline-card normal"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/community/${deadline.communityId}`)}
                    >
                      <div className="deadline-card-header">
                        <h4 className="deadline-card-title">{deadline.title}</h4>
                        <span className={`deadline-priority ${deadline.priority}`}>
                          {deadline.priority}
                        </span>
                      </div>
                      <div className="deadline-card-body">
                        <span className="deadline-date">📅 {formatDate(deadline.date)}</span>
                        <span className="deadline-countdown normal">
                          {daysUntil} day{daysUntil !== 1 ? 's' : ''} left
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#718096' }}>
                        📍 {deadline.communityName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
